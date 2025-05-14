export default function LoginView({ onLogin }) {
    const handleLogin = () => {
        onLogin({ name: 'Иван', role: 'user' });
    };

    return (
        <section className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Вход</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <input type="text" placeholder="Email" className="w-full mb-3 p-3 border rounded" required />
                <input type="password" placeholder="Пароль" className="w-full mb-4 p-3 border rounded" required />
                <button type="submit" className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition">Войти</button>
            </form>
        </section>
    );
}