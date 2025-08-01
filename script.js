document.addEventListener("DOMContentLoaded", () => {
    // linking ids
    const categorySelect = document.getElementById("category");
    const drawArea       = document.getElementById("draw-area");
    const cardsContainer = document.getElementById("cards");
    const confirmBtn     = document.getElementById("confirm-btn");
    const deckDiv        = document.getElementById("deck");
    const usedDiv        = document.getElementById("used-deck");
    const deckMaxSpan    = document.getElementById("deck-max");
    const adminBtn       = document.getElementById("admin-btn");
    const adminPanel     = document.getElementById("admin-panel");
    const adminClose     = document.getElementById("admin-close");
    const adminAddInput  = document.getElementById("admin-add-input");
    const adminAddBtn    = document.getElementById("admin-add-btn");
    const adminUsedDiv   = document.getElementById("admin-used");
    const exportBtn      = document.getElementById("export-deck-btn");
    const exportArea     = document.getElementById("export-area");
    const importArea     = document.getElementById("import-area");
    const importBtn      = document.getElementById("import-deck-btn");
    const modal          = document.getElementById("curse-modal");
    const curseTitle     = document.getElementById("curse-title");
    const curseText      = document.getElementById("curse-text");
    const copyCurseBtn   = document.getElementById("copy-curse");
    const modalClose     = document.getElementById("modal-close");
  
    // state
    let drawnCards = [], keepCount = 0, selected = [];
    let deck = [], used = [], maxDeck = 6;
  
    // powerups mapping
    const POWERUPS = {
      62:"D1D2",63:"D1D2",64:"D1D2",65:"D1D2",
      66:"D2D3",67:"D2D3",68:"D2D3",69:"D2D3",
      70:"D1E1",71:"D1E1"
    };
  
    // all of the curses' data
    const CURSES = {
      70:{name:"Curse of The Zoologist",text:`Take a photo of a wild fish, bird, mammal, reptile, amphibian or bug. The seeker(s) must take a picture of a wild animal in the same category before  asking another question.\nCasting Cost: A photo of an animal`},
      71:{name:"Curse Of The Unguided Tourist",text:`Send the seeker(s) an unzoomed google Street View image from a street within 500ft (152m) of where they are now. The shot has to be parallel to the horizon and include at least one human-built structure other than a road. Without using the internet for research, they must find what you sent them in real life before they can use transportation or ask another question. They must send a picture the hiders for verification.\nCasting Cost: Seker(s) must be outside`},
      72:{name:"Curse Of The Endless Tumble",text:`Seekers Must roll a die at least 100ft (30m) and have it land on a 5 or a 6 before they can ask another question. The die must roll the full distance, unaided, using only the momentum from the initial throw and gravity to travel the 100ft (30m). If the seekers accidentally hit someone with a die you are awarded a [S10, M20, L30] minute bonus\nCasting Cost: Roll a die. If its 5 or 6 this card has no effect.`},
      73:{name:"Curse Of The Hidden Hangman",text:`Before asking another question or boarding another form of transportation, seeker(s) must be the hider(s) in game of hangman.\nCasting Cost: Discard 2 cards`},
      74:{name:"Curse Of The Overflowing Chalice",text:`For the next three questions, you may draw (not keep) an additional card when drawing from the hider deck\nCasting Cost: Discard a card`},
      75:{name:"Curse Of The Mediocre Travel Agent",text:`Choose any publicly-accessible place within [S0.25, M0.25, L0.50]mi [S0.40, M0.40, 0.50]km of the seeker(s) current location. They cannot currently be on transit. They must go there, and spend at least [S5, M5, L10] minutes there, before asking another question. They must send you at least three photos of them enjoying their vacation, and procure an object to bring you as souvenir. If this souvenir is lost before they can get to you, you are awarded and extra [S30, M45, L60] minutes.\nCasting Cost: `},
      76:{name:"Curse Of The Luxury Car",text:`Take a photo of a car. The seekers must take a photo of a more expensive car before asking another question.\nCasting Cost: A photo of a car`},
      77:{name:"Curse Of The U-Turn",text:`Seeker(s) must disembark their current mode of transportation at the next station (as long as that station is served by another form of transit in the next [S0.5, M0.5, L1] hours\nCasting Cost: Seekers must be heading the wrong way. (Their next station is further from you then they are.)`},
      78:{name:"Curse Of The Bridge Troll",text:`The seekers must ask their next question from under a bridge\nCasting Cost: Seekers Must be at least [S1, M5, L30]mi [S0.3, M1.5, L9.1]km from you`},
      79:{name:"Curse Of Water Weight",text:`Seeker(s) must acquire and carry at least 2 liters of liquid per seeker for the rest of your run. They cannot ask another question until they have acquired the liquid. The water may be distributed between seeker as they see fit. If the liquid is lost or abandoned at any point the hider is awarded a [S30, M30, L60] minute bonus\nCasting Cost: Seekers must be within 1,000ft (300 meters) of a body of water`},
      80:{name:"Curse Of The Jammed Door",text:`For the next [S0.5, M1, L3] hours, whenever the seeker(s) want to pass through a doorway into a building, business, train, or other vehicle they must first roll 2 dice. If they do not roll a 7 or higher they cannot enter that space (including through other doorways) any given doorway can be reattempted after [S5, M10, L15] minutes.\nCasting Cost: Discard 2 cards`},
      81:{name:"Curse Of The Cairn",text:`You have one attempt to stack as many rocks on top of each other as you can in a freestanding tower. Each rock may only touch one other rock. Once you have added a rock to the tower it may not be removed. Before adding another rock, the tower must stand for at least 5 seconds. If at any point any rock other then the base rock touches the ground, your tower has fallen. Once your tower falls tell the seekers how many rocks high your tower was when it last stood for five seconds. The seekers must then construct a rock tower of the same number of rucks, under the same parameters before asking another question. If their tower falls they must restart. The rocks must be found in nature and both teams must disperse the rocks after building.\nCasting Cost: Build a rock tower`},
      82:{name:"Curse Of The Urban Explorer",text:`For the rest of the run seekers cannot ask question when they are on transit or in a train station\nCasting Cost: Discard 2 cards`},
      83:{name:"Curse Of The Impressionable Consumer",text:`Seekers must enter and gain admission (if applicable) to a location or buy a product that they saw an advertisement for before asking another question. This advertisement musts be found out in the world and must be at least 100ft (30m) from the product or location itself.\nCasting Cost: The seekers next question is free`},
      84:{name:"Curse Of The Egg Partner",text:`Seeker(s) must acquire an egg before asking another question. This egg is now treated as an official team member of the seekers. If any team members are abandoned or killed (defined as crack in the eggs case) before the end of your run you are awarded an extra [S30 M45 L60] minutes. This course cannot be played during the endgame.\nCasting Cost: Discard two cards`},
      85:{name:"Curse Of The Distant Cuisine",text:`Find a restaurant within your zone that explicitly serves food from a specific foreign country. The seekers must visit a restaurant serving food from a country that is equal or great distance away before asking another question\nCasting Cost: You must be at the restaurant`},
      86:{name:"Curse Of The Right Turn",text:`For the next [S20, M40, L60] minutes the seekers can only turn right at any street intersection. If at any point they find themselves in dead end where they cannot continue forward or turn right for another 1,000ft (304m) they must do a full 180. A right turn is defined as a road at any angle that veers to the right of the seekers\nCasting Cost: Discard a card`},
      87:{name:"Curse Of The Labyrinth",text:`Spend up to [S10, M20, L30] minutes drawing a solvable maze and send a photo of it to the seekers. You cannot use the internet to research maze designs. The seekers musts solve the maze before asking another question.\nCasting Cost: Draw a maze`},
      88:{name:"Curse Of The Bird Guide",text:`You have one chance to film a bird for as long as possible. Up to [S5 M10 L15] minutes straight, if at any point the bird leaves the frame your timer is stopped. The seekers must then film a bird for the same amount of time or longer\nCasting Cost: Film a bird`},
      89:{name:"Curse Of Spotty Memory",text:`For the rest of the run, one random category of questions will be disabled at all times. After this curse is played seeker(s) must roll a die to determine the category of questions to be disabled. The catergy remain disabled until the next question is asked at which point a die is rolled again to choose an e category. The same category can be disabled multiple times in a row\nCasting Cost: Discard a time bonus card`},
      90:{name:"Curse Of The Lemon Phylactery",text:`Before asking another question the seeker(s) must each find a lemon and affix it to their outermost layer of their clothes or skin. If at any point one of these lemons is no longer touching a seeker you are awarded [S30, M45, L60] minutes. This curse cannot be played during the endgame.\nCasting Cost: Discard a powerup card`},
      91:{name:"Curse Of The Drained Brain",text:`Choose three questions in different categories. The seekers cannot ask those questions for the rest of the run.\nCasting Cost: Discard your hand`},
      92:{name:"Curse Of The Ransom Note",text:`The next question that the seekers ask must be composed of words and letters cut out of any printed material. The question must be coherent and include at least 5 words.\nCasting Cost: Spell out "Ransom Note" as a ransom note (without using this card)`},
      93:{name:"Curse Of The Gambler's Feet",text:`For the next [S20, M40, L60] minutes seekers must roll a die before they take any steps in any direction, they may take that many steps before rolling again\nCasting Cost: Roll a die if its even number this curse has no effect`}
    };
  
    // Helpers
    function drawRandom(n){
      const s=new Set();
      while(s.size<n) s.add(Math.floor(Math.random()*95)+1);
      return[...s];
    }
    function getLabel(num){
      if(num<=50){
        const m = num<=20?2:num<=35?4:num<=45?6:num<=48?8:12;
        return `#${num}: ${m} minutes`;
      }
      if(num>=51&&num<=61){
        const m={51:"Randomize",52:"Randomize",53:"Randomize",54:"Randomize",
                 55:"Veto",56:"Veto",57:"Veto",58:"Veto",
                 59:"Duplicate",60:"Duplicate",61:"Move"};
        return `#${num}: ${m[num]||"Powerup"}`;
      }
      if(num>=62&&num<=71) return `#${num}: ${POWERUPS[num]}`;
      if(num>=72&&num<=93) return `#${num}: ${CURSES[num].name}`;
      return `#${num}: Card`;
    }
  
    function makeSelectable(num){
      const c=document.createElement("div");
      c.className="card border bg-white p-2 rounded text-sm cursor-pointer";
      c.textContent=getLabel(num);
      c.onclick=()=>{
        if(selected.includes(num)){
          selected=selected.filter(x=>x!==num); c.classList.remove("bg-yellow-200");
        } else if(selected.length<keepCount){
          selected.push(num); c.classList.add("bg-yellow-200");
        }
        confirmBtn.disabled=selected.length!==keepCount;
      };
      return c;
    }
  
    function makeDeckCard(num){
      const c=document.createElement("div");
      c.className="card border bg-white p-2 rounded text-sm flex flex-col";
      c.dataset.num=num;
      c.textContent=getLabel(num);
      const btns=document.createElement("div"); btns.className="mt-2 flex gap-2";
  
      // discarding
      const d=document.createElement("button");
      d.textContent="Discard"; d.className="text-red-600 text-xs underline";
      d.onclick=()=>processCard(num,"discard");
      btns.appendChild(d);
  
      // Use?
      const canUse = (
        (62<=num&&num<=65&&deck.length>1) ||
        (66<=num&&num<=69&&deck.length>2) ||
        (70<=num&&num<=93)
      );
      if(canUse){
        const u=document.createElement("button");
        u.textContent="Use"; u.className="text-green-600 text-xs underline";
        u.onclick=()=>processCard(num,"use");
        btns.appendChild(u);
      }
  
      // View?
      if(72<=num&&num<=93){
        const v=document.createElement("button");
        v.textContent="View"; v.className="text-blue-600 text-xs underline";
        v.onclick=()=>showCurse(num);
        btns.appendChild(v);
      }
  
      c.appendChild(btns);
      return c;
    }
  
    function render(){
      deckDiv.innerHTML=""; usedDiv.innerHTML="";
      deck.forEach(n=> deckDiv.appendChild(makeDeckCard(n)));
      used.forEach(n=>{
        const u=document.createElement("div");
        u.className="card-used card border bg-white p-2 rounded text-sm";
        u.textContent=getLabel(n);
        usedDiv.appendChild(u);
      });
      deckMaxSpan.textContent=maxDeck;
      if(!adminPanel.classList.contains("hidden")){
        renderAdminUsed();
      }
    }
  
    // draw select
    categorySelect.onchange=()=>{
      const cat=categorySelect.value;
      if(!cat) return;
      cardsContainer.innerHTML=""; drawArea.classList.remove("hidden");
      selected=[]; confirmBtn.disabled=true;
      let draw=0,pick=0;
      if(cat==="heads"||cat==="measuring"){draw=3;pick=1;}
      if(cat==="tails"){draw=4;pick=2;}
      if(cat==="photo"){draw=1;pick=1;}
      if(cat==="radar"){draw=2;pick=1;}
      keepCount=pick;
      drawnCards=drawRandom(draw);
      drawnCards.forEach(n=>cardsContainer.appendChild(makeSelectable(n)));
    };
  
    confirmBtn.onclick=()=>{
      if(deck.length+selected.length>maxDeck){alert("Deck full");return;}
      deck.push(...selected);
      drawArea.classList.add("hidden"); cardsContainer.innerHTML="";
      categorySelect.value=""; selected=[];
      render();
    };
  
    // interacting w/cards
    function processCard(num, action){
      if(action==="use"){
        if(62<=num&&num<=65){
          const ans=prompt("Enter 1 other card to discard, e.g. \"23\":");
          if(!ans) return;
          const pick=+ans.trim();
          if(!deck.includes(pick)||pick===num){
            alert("Invalid card. Aborting."); return;
          }
          deck=deck.filter(x=>x!==num&&x!==pick);
          used.push(num,pick);
          drawRandom(2).forEach(n=>deck.push(n));
        }
        else if(66<=num&&num<=69){
          const ans=prompt("Enter 2 cards to discard, comma-separated, e.g. \"12,34\":");
          if(!ans) return;
          const parts=ans.split(",").map(x=>+x.trim());
          if(parts.length!==2||parts.some(x=>!deck.includes(x)||x===num)){
            alert("Invalid format or cards. Aborting."); return;
          }
          deck=deck.filter(x=>x!==num&&x!==parts[0]&&x!==parts[1]);
          used.push(num,parts[0],parts[1]);
          drawRandom(3).forEach(n=>deck.push(n));
        }
        else if(70<=num&&num<=71){
          deck=deck.filter(x=>x!==num);
          used.push(num);
          maxDeck++;
        }
        else if(72<=num&&num<=93){
          deck=deck.filter(x=>x!==num);
          used.push(num);
        } else return;
      }
      else if(action==="discard"){
        deck=deck.filter(x=>x!==num);
        used.push(num);
      }
      render();
    }
  
    // curse modal
    function showCurse(num){
      const c=CURSES[num];
      curseTitle.textContent=`#${num}: ${c.name}`;
      curseText.textContent=c.text;
      modal.classList.remove("hidden");
    }
    modalClose.onclick=()=>modal.classList.add("hidden");
    copyCurseBtn.onclick=()=>navigator.clipboard.writeText(`${curseTitle.textContent}\n\n${curseText.textContent}`);
  
    // admin mode
    adminBtn.onclick=()=>{
      const pwd=prompt("Enter admin password:");
      if(pwd==="pah"){
        renderAdminUsed();
        adminPanel.classList.remove("hidden");
      } else alert("Wrong password");
    };
    adminClose.onclick=()=>adminPanel.classList.add("hidden");
  
    adminAddBtn.onclick=()=>{
      const n=+adminAddInput.value;
      if(n>=1&&n<=95&&deck.length<maxDeck){
        deck.push(n);
        render();
        adminAddInput.value="";
      }
    };
  
    // admin: render discarded with restore/delete
    function renderAdminUsed(){
      adminUsedDiv.innerHTML="";
      used.forEach(n=>{
        const u=document.createElement("div");
        u.className="card border bg-white p-2 rounded text-sm cursor-pointer";
        u.textContent=getLabel(n);
        u.onclick=()=>{
          used=used.filter(x=>x!==n);
          deck.push(n);
          render();
          renderAdminUsed();
        };
        u.oncontextmenu=e=>{
          e.preventDefault();
          if(confirm(`Delete #${n} permanently?`)){
            used=used.filter(x=>x!==n);
            renderAdminUsed();
          }
        };
        adminUsedDiv.appendChild(u);
      });
    }
  
    // share
    exportBtn.onclick=()=>{
      exportArea.value=JSON.stringify({deck,used});
    };
    importBtn.onclick=()=>{
      let data;
      try{
        data=JSON.parse(importArea.value);
        if(!Array.isArray(data.deck)||!Array.isArray(data.used)) throw 0;
        if(![...data.deck,...data.used].every(x=>Number.isInteger(x)&&x>=1&&x<=95)) throw 0;
      }catch{
        alert("Invalid format. Use JSON {deck:[...],used:[...]}");
        return;
      }
      deck=data.deck.slice();
      used=data.used.slice();
      render();
      renderAdminUsed();
      alert("Imported!");
    };
  
    // first render
    render();
  });
  