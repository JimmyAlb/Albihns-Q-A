const CATS = ["Geografi","Underhållning","Historia","Konst & litteratur","Natur & vetenskap","Sport & fritid"];
module.exports = async (req, res) => {
  try{
    const difficulty = (req.query.difficulty || "medium").toLowerCase();
    if (process.env.OPENAI_API_KEY){
      const prompt = `Skapa exakt 6 svenska quizfrågor som JSON-array med objekt {q,a,c}. c måste vara en av: ${CATS.join(", ")}. Svårighetsgrad: ${difficulty}. Inget annat än JSON.`;
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method:"POST",
        headers:{ "Authorization":"Bearer " + process.env.OPENAI_API_KEY, "Content-Type":"application/json" },
        body: JSON.stringify({ model:"gpt-4o-mini", messages:[{role:"user", content:prompt}], temperature:0.7 })
      });
      if(!r.ok) throw new Error("OpenAI fel: " + r.status);
      const data = await r.json();
      const text = data.choices?.[0]?.message?.content || "[]";
      let arr = []; try{ arr = JSON.parse(text); }catch{}
      arr = (Array.isArray(arr)?arr:[]).slice(0,6).map(x=>({ q:String(x.q||"").trim(), a:String(x.a||"").trim(), c:CATS.includes(x.c)?x.c:CATS[Math.floor(Math.random()*CATS.length)] }));
      if(arr.length!==6) throw new Error("Fel antal frågor");
      res.setHeader("Cache-Control","no-store");
      return res.status(200).json(arr);
    }
    return res.status(200).json([
      {q:"Sveriges största sjö?", a:"Vänern", c:"Geografi"},
      {q:"Vilken metall har beteckningen Fe?", a:"Järn", c:"Natur & vetenskap"},
      {q:"Vem målade Mona Lisa?", a:"Leonardo da Vinci", c:"Konst & litteratur"},
      {q:"Vem sjöng 'Dancing Queen'?", a:"ABBA", c:"Underhållning"},
      {q:"När började första världskriget?", a:"1914", c:"Historia"},
      {q:"Vilket land vann EM i fotboll 2024 (herr)?", a:"Spanien", c:"Sport & fritid"}
    ]);
  }catch(e){ res.status(500).json({error:String(e)}); }
};