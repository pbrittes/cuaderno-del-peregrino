import { ShellLogo } from '../../components/ShellLogo'

export function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <ShellLogo size={96} />

        <p className="eyebrow">Expedición Santiago 2026</p>

        <h1>Cuaderno del Peregrino</h1>

        <p className="travellers">Pri • Tania • Andrea</p>

        <blockquote>
          “Caminante, no hay camino,
          <br />
          se hace camino al andar.”
        </blockquote>

        <p className="author">Antonio Machado</p>
      </section>
    </main>
  )
}