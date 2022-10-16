import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import "./styles/main.css";

import logo from "./assets/logo.svg";
import { GameBanner } from "./components/GameBanner";
import { CreateAdBanner } from "./components/CreateAdBanner";
import { CreateAdModal } from "./components/CreateAdModal";


interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  }
}

function App() {
  const [games, setGames] = useState<Game[]>([]);

  /**
   * Se deixar o segundo parâmetro do useEffect vazio, o código vai executar uma única vez, ou seja, 
   * não importa quantas vezes o estado mudar, o código dentro da função vai executar apenas uma vez
   */
  useEffect(()=>{
    fetch('http://localhost:3333/games')
      .then(response=> response.json())
      .then(data => {
        setGames(data)
      })
  }, [])

  return (
    <div>
      <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
        <img src={logo} alt="Logo eSports" />

        <h1 className="text-6xl text-white font-black mt-20">
          Seu <span className="text-transparent bg-nlw-gradient bg-clip-text"> duo </span> está aqui
        </h1>

        <div className="grid grid-cols-6 gap-6 mt-16">
          {games.map(game => {
              return(
                <GameBanner 
                  key={game.id}
                  bannerUrl={game.bannerUrl} 
                  title={game.title}
                  adsCount={game._count.ads} 
                />
              )
          })}
        </div>

          <Dialog.Root>
            <CreateAdBanner />
            <CreateAdModal />
           
          </Dialog.Root>
      </div>
    </div>
  );
}

export default App;
