import {json, LoaderFunction} from "@remix-run/node";
import {useParams} from "react-router";
import {useLoaderData} from "@remix-run/react";
import { useState } from "react";

const Row=({children,...overrideStyled}:{children:React.ReactNode,overrideStyled?:React.CSSProperties})=>{
    return(
            <div style={{display:"flex",flexDirection:"row",...overrideStyled}}>
              {children}
              </div>
    )
}
const Col=({children,...overrideStyled}:{children:React.ReactNode,overrideStyled?:React.CSSProperties})=>{
    return(
            <div style={{display:"flex",flexDirection:"column",...overrideStyled}}>
              {children}
            </div>
            )
}


interface IAbility{
    name_loc:String
     name :String
  desc_loc:String
  cooldowns:[]
  heroName:String
}
//https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/abilities/earth_spirit/earth_spirit_geomagnetic_grip.webm

export const Ability=({ability,heroName}:{ability:IAbility,heroName:String})=>{
    const {name_loc,name,desc_loc,cooldowns} = ability
  console.log("ability",ability)
    return(
            <div style={{padding:5}}>
              <h4>{name_loc}</h4>
              <p>{desc_loc}</p>
              <div style={{display:"flex",flexDirection:"row",alignItems:"center",gap:5}}>
                <div style={{
                    backgroundPosition:"center",
                  backgroundRepeat:"no-repeat",
                  backgroundSize:"cover",
                  width:16,
                  height:16,
                    backgroundImage:'url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/cooldown.png")'
                }}></div>
                {
                  cooldowns.map(cooldown=>cooldown.toFixed(1)).join(" /  ")
                }
                {
                  <video id={name} key={name} width="640" height="480" autoPlay  playsinline muted loop style={{marginLeft:"auto",margin:5,position:"absolute",right:0,bottom:200}}>
                    <source src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/abilities/${heroName}/${name}.webm`} type="video/webm"/>
                         </video>
                }
              </div>
            </div>
    )
}

export const Abilities=({abilities,heroName}:{abilities:[IAbility],heroName:String})=>{

    const [selectedAbility,setSelectedAbility] = useState<IAbility>()

    return(
            <div style={{color:"white",flex:1}} >
              <Col overrideStyled={{alignContent:"center",justifyContent:"center"}}>
                <h3 style={{textAlign:"center"}}>ABILITIES</h3>
                <Row>
                  {abilities.map((ability:IAbility,key) =>{
                      const {name_loc,name,desc_loc} = ability
                    return(
                            <div key={key} onClick={()=>setSelectedAbility(ability)} style={{display:"flex",flexDirection:"column",minWidth:150,margin:5}}>
                              <img  src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${name}.png`}
                                style={{filter: name === selectedAbility?.name ?   "brightness(0.9)" : "brightness(0.5)"}}/>
                            </div>
                            )
                  })}
                </Row>
              </Col>
              {
                selectedAbility &&  <Ability heroName={heroName} ability={selectedAbility} />
              }
            </div>
    )
}


export async function getHeroById(heroId: Number) {
    const res = await fetch(`https://www.dota2.com/datafeed/herodata?language=english&hero_id=${heroId}`).then((res) => res.json());
    return res.result.data.heroes[0];
}

export const loader: LoaderFunction = async ({params}) => {
    return json({
        hero: await getHeroById(Number(params.heroId))
    });
};
const ChangeHero = () => {
    const {heroId} = useParams();

    return (
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <a style={{fontSize: 25, textDecoration: "none", color: "white"}} href={`${Number(heroId) - 1}`}>Back</a>
            <a style={{fontSize: 25, textDecoration: "none", color: "white"}} href={`${Number(heroId) + 1}`}>Next</a>
        </div>
    );
};

export default function Hero() {

    const {hero} = useLoaderData();
    const {id, name, name_loc, bio_loc, npe_desc_loc, abilities} = hero;
    console.log("hero",hero)
    return (
        <div key={id} style={{
            padding: 10,
            backgroundImage: 'url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react//backgrounds/greyfade.jpg")',
          height: "100%",
          backgroundPosition:"center",
          backgroundRepeat:"no-repeat",
          backgroundSize:"cover",
          color: "#fff"
        }}>
            <ChangeHero/>
          <Row>
            <Col overrideStyled={{flex:1}}>
              <h1 style={{fontSize:36}}>{name_loc}</h1>
              <h5 style={{ fontSize: 18}}>{npe_desc_loc}</h5>
              <p style={{ fontWeight: 200, fontSize: 24,maxWidth:"80%"}}>{bio_loc}</p>
            </Col>
            <Abilities heroName={name?.split("npc_dota_hero_")[1]}  key={abilities.id} abilities={abilities} />
          </Row>

        </div>
    );
}



