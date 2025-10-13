import {Header} from "../components/Header";
import {Hero} from "../components/Hero";
import {ProductosDestacados} from "../components/ProductosDestacados";
import {Footer} from "../components/Footer";


export const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <ProductosDestacados />
      <Footer />
    </div>
  )
}

export default Home;