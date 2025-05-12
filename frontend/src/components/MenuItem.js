import React, { useState } from 'react';
import { getMenuItems } from '../api';

const MenuItem = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', category_id: '', description: '' });

  useEffect(() => {
    getMenuItems().then((res) => setItems(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Меню</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border p-4">
            <h3>{item.name}</h3>
            <p>{item.price} ₽</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuItem;