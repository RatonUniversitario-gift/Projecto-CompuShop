// src/components/SeccionBase.jsx
export default function SeccionBase({ titulo, subtitulo, children }) {
  return (
    <main
      className="py-5 text-white"
      style={{
        background: "radial-gradient(circle at 30% 30%, #213E60 0%, #0b0c10 70%)",
        boxShadow: "inset 0 -10px 40px rgba(0, 180, 216, 0.3)",
      }}
    >
      <div className="container">
        <h1 className="text-center mb-3">{titulo}</h1>
        {subtitulo && (
          <p className="text-center text-secondary mb-5">{subtitulo}</p>
        )}
        {children}
      </div>
    </main>
  );
}
    