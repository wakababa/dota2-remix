import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

export async function gerHeroes() {
  const res = await fetch(`https://www.dota2.com/datafeed/herolist?language=english`).then((res) => res.json());
  return res.result.data.heroes;
}


type LoaderData = {
  heroes: Awaited<ReturnType<typeof gerHeroes>>;
};
export const loader = async () => {
  return json<LoaderData>({
    heroes: await gerHeroes()
  });
};

type HeroProps = {
  id: Number
  name: String
  name_loc: String
  name_english_loc: String
  primary_attr: keyof typeof Primary_attrEnum,
  complexity: Number
}

enum Primary_attrEnum {
  Strength,
  Agility,
  Intelegent
}

const Hero = ({ hero }: { hero: HeroProps }) => {
  const {id, name, name_english_loc, primary_attr } = hero;
  return (
    <a style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-end",
      backgroundImage: `url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${name.split("npc_dota_hero_")[1]}.png")`,
      backgroundSize: "cover",
      left: "calc(122px + (2 * (100% - 225px)) / 4)",
      top: "calc(284px)",
      width: 225,
      height: 127,
      textDecoration:"none"
    }}
      href={`heroes/${id}`}
    >
      <h6 style={{
        marginTop: "auto",
        background: "white",
        padding: 10,
        margin: 0,
        borderTopRightRadius: 20
      }}>{name_english_loc}</h6>
    </a>
  );
};

const SearchHeroes = ({ onHandleChange }: { onHandleChange: Function }) => {
  return (
    <input style={{ padding: 15, margin: 5 }} placeholder={"Search"} type={"text"}
           onChange={(e) => onHandleChange(e.target.value)} />
  );
};

export default function Heroes() {
  const { heroes } = useLoaderData() as LoaderData;
  const [search, setSearch] = useState<String>("");
  return (
    <div style={{
      display: "flex",
      flexDirection: "column", alignItems: "center",
      backgroundImage: "url('https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/backgrounds/featured.jpg')",
      padding: 10,
      height: "100%",
      backgroundPosition: "center",
      backgroundRepeat:"no-repeat",
      backgroundSize: "cover"
    }}>
      <SearchHeroes onHandleChange={(val: String) => setSearch(val)} />
      <div style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: 700
      }}>
        {heroes.filter((hero: HeroProps) => hero.name_english_loc.toLocaleLowerCase().includes(String(search))).map((hero: HeroProps) =>
          <Hero hero={hero} />)}
      </div>
    </div>
  );
}


export function ErrorBoundary({ error }:{error:String}) {
    console.error(error);
    return (
        <html>
        <head>
            <title>Oh no!</title>
        </head>
        <body>
        {JSON.stringify(error)}
        {/* add the UI you want your users to see */}
        </body>
        </html>
    );
}
