export default function HomeView({ onLogin }) {
    return (
        <section className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Добро пожаловать в наше кафе!</h2>
            <p className="mb-6 text-lg">Заказывайте еду прямо за столиком и наслаждайтесь уютной атмосферой.</p>
            <img src="/images/cafe.jpg" alt="Кафе интерьер" className="w-full rounded-lg shadow-md mb-6" />
            <button onClick={onLogin} className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition">Начать заказ</button>
        </section>
    );
}