import React, { useState, useEffect } from 'react';
import { getOrders, updateOrder } from '../api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then((res) => setOrders(res.data));
  }, []);

  const handleStatusChange = async (order, newStatus) => {
    await updateOrder(order.id, { ...order, status: newStatus });
    setOrders(orders.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Список заказов</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Код доступа</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.total_price} ₽</td>
              <td>{order.status}</td>
              <td>{order.access_code || '-'}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order, e.target.value)}
                  className="border p-1"
                >
                  <option value="new">Новый</option>
                  <option value="in_progress">В работе</option>
                  <option value="ready">Готов</option>
                  <option value="paid">Оплачен</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;