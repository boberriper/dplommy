import React, { useState, useEffect } from 'react';
import { getMenuItems, createOrder, generateAccessCode } from '../api';

const OrderForm = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [accessCode, setAccessCode] = useState('');

  useEffect(() => {
    getMenuItems().then((res) => setMenuItems(res.data));
  }, []);

  const addItem = (item) => {
    setOrderItems([...orderItems, { menu_item_id: item.id, quantity: 1 }]);
  };

  const updateQuantity = (index, quantity) => {
    const updatedItems = [...orderItems];
    updatedItems[index].quantity = parseInt(quantity);
    setOrderItems(updatedItems);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const menuItem = menuItems.find((m) => m.id === item.menu_item_id);
      return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const order = {
      items: orderItems,
      total_price: calculateTotal(),
      access_code: accessCode,
      status: 'new',
    };
    await createOrder(order);
    setOrderItems([]);
    setAccessCode('');
  };

  const handleGenerateCode = async () => {
    const res = await generateAccessCode();
    setAccessCode(res.data.code);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Создать заказ</h2>
      <button onClick={handleGenerateCode} className="bg-blue-500 text-white p-2 mb-4">
        Сгенерировать код доступа
      </button>
      {accessCode && <p>Код доступа: {accessCode}</p>}
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <div key={item.id} className="border p-4">
            <h3>{item.name}</h3>
            <p>{item.price} ₽</p>
            <button onClick={() => addItem(item)} className="bg-green-500 text-white p-2">
              Добавить
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        {orderItems.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <span>{menuItems.find((m) => m.id === item.menu_item_id)?.name}</span>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateQuantity(index, e.target.value)}
              className="border p-1 ml-2"
              min="1"
            />
          </div>
        ))}
        <p className="text-xl">Итого: {calculateTotal()} ₽</p>
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
          Создать заказ
        </button>
      </form>
    </div>
  );
};

export default OrderForm;