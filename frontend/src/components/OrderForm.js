import React, { useState, useEffect } from 'react';
import { getMenuItems, getCategories, createOrder, generateAccessCode } from '../api';

const OrderForm = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories()
        .then((res) => setCategories(res.data))
        .catch((err) => console.error('Ошибка загрузки категорий:', err));
    getMenuItems()
        .then((res) => setMenuItems(res.data))
        .catch((err) => console.error('Ошибка загрузки меню:', err));
  }, []);

  const filteredMenuItems = selectedCategory
      ? menuItems.filter((item) => item.category.id === selectedCategory)
      : menuItems;

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.menu_item_id === item.id);
    if (existingItem) {
      setCart(
          cart.map((cartItem) =>
              cartItem.menu_item_id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
          )
      );
    } else {
      setCart([...cart, { menu_item_id: item.id, name: item.name, price: item.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (menu_item_id) => {
    setCart(cart.filter((item) => item.menu_item_id !== menu_item_id));
  };

  const updateQuantity = (menu_item_id, quantity) => {
    if (quantity < 1) {
      removeFromCart(menu_item_id);
    } else {
      setCart(
          cart.map((item) =>
              item.menu_item_id === menu_item_id ? { ...item, quantity: parseInt(quantity) } : item
          )
      );
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleGenerateCode = async () => {
    try {
      const res = await generateAccessCode();
      setAccessCode(res.data.code);
      setError(null);
    } catch (error) {
      console.error('Ошибка генерации кода:', error.response?.data || error.message);
      setError('Не удалось сгенерировать код доступа.');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Корзина пуста!');
      return;
    }
    if (!accessCode) {
      setError('Сгенерируйте код доступа!');
      return;
    }
    const order = {
      items: cart.map((item) => ({
        menu_item: item.menu_item_id, // Изменено с menu_item_id на menu_item
        quantity: item.quantity,
      })),
      total_price: parseFloat(calculateTotal()),
      access_code: accessCode,
      status: 'new',
    };
    try {
      console.log('Отправка заказа:', order); // Для отладки
      await createOrder(order);
      alert('Заказ успешно создан!');
      setCart([]);
      setAccessCode('');
      setError(null);
    } catch (error) {
      console.error('Ошибка при создании заказа:', error.response?.data || error.message);
      setError(`Ошибка при создании заказа: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
      <div className="p-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Оформление заказа</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Категории</h3>
          <div className="flex flex-wrap gap-2">
            <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded ${
                    selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
            >
              Все
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded ${
                        selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                  {category.name}
                </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Меню</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredMenuItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 shadow-sm">
                  <h4 className="text-lg font-medium">{item.name}</h4>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-green-600 font-semibold">{item.price} ₽</p>
                  <button
                      onClick={() => addToCart(item)}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Добавить в корзину
                  </button>
                </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Корзина</h3>
          {cart.length === 0 ? (
              <p className="text-gray-500">Корзина пуста</p>
          ) : (
              <div>
                {cart.map((item) => (
                    <div key={item.menu_item_id} className="flex justify-between items-center mb-2">
                <span>
                  {item.name} ({item.price} ₽ x {item.quantity})
                </span>
                      <div className="flex items-center">
                        <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.menu_item_id, e.target.value)}
                            className="border w-16 p-1 mr-2"
                        />
                        <button
                            onClick={() => removeFromCart(item.menu_item_id)}
                            className="text-red-500 hover:text-red-700"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                ))}
                <p className="text-xl font-bold mt-4">Итого: {calculateTotal()} ₽</p>
              </div>
          )}
        </div>

        <div className="mt-4">
          <button
              onClick={handleGenerateCode}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Сгенерировать код доступа
          </button>
          {accessCode && <p className="inline-block text-gray-700">Код доступа: {accessCode}</p>}
        </div>
        <form onSubmit={handleCheckout} className="mt-4">
          <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
          >
            Оформить заказ
          </button>
        </form>
      </div>
  );
};

export default OrderForm;