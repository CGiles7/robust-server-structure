const express = require("express");
const app = express();

app.use(express.json());

const urlsData = require("./data/urls-data");
const usesData = require("./data/uses-data");

function findUrlById(id) {
  return urlsData.find(url => url.id === id);
}

function findUseById(urlId, useId) {
  return usesData.find(use => use.urlId === urlId && use.id === useId);
}


//PATH /URLS
app.post("/urls", (req, res) => {
  const { href } = req.body.data;

  if (!href) {
    res.status(400).json({ error: "Missing 'href' property" });
    return;
  }

  const newUrlId = urlsData.length + 1;
  const newUrl = { id: newUrlId, href };
  urlsData.push(newUrl);

  res.status(201).json({ data: newUrl });
});

app.get("/urls", (req, res) => {
  res.status(200).json({ data: urlsData });
});

app.put("/urls", (req, res) => {
  res.status(405).json({ error: "Method Not Allowed: PUT" });
});

app.delete("/urls", (req, res) => {
  res.status(405).json({ error: "Method Not Allowed: DELETE" });
});





//PATH /URLS/:URLID
app.get("/urls/:urlId", (req, res) => {
  const urlId = parseInt(req.params.urlId);
  const url = urlsData.find(url => url.id === urlId);
  
  if (url) {
    const currentTime = Date.now();
    const useRecord = {
      id: usesData.length + 1,
      urlId: url.id,
      time: currentTime,
    };
    usesData.push(useRecord);
    
    res.status(200).json({ data: url });
  } else {
    res.status(404).json({ error: `URL with ID ${urlId} not found` });
  }
});

app.put("/urls/:urlId", (req, res) => {
  const urlId = parseInt(req.params.urlId);
  const updatedUrl = req.body.data;
  const urlIndex = urlsData.findIndex(url => url.id === urlId);
  
  if (urlIndex !== -1) {
    urlsData[urlIndex] = { ...urlsData[urlIndex], ...updatedUrl };
    res.status(200).json({ data: urlsData[urlIndex] });
  } else {
    res.status(404).json({ error: `URL with ID ${urlId} not found` });
  }
});

app.post("/urls/:urlId", (req, res) => {
  res.status(405).json({ error: "POST" });
});

app.delete("/urls/:urlId", (req, res) => {
  res.status(405).json({ error: "DELETE" });
});






//PATH /URLS/:URLID/USES
app.get("/urls/:urlId/uses", (req, res) => {
  const urlId = parseInt(req.params.urlId);
  const useMetrics = usesData.filter(use => use.urlId === urlId);
  
  if (useMetrics.length === 0) {
    res.status(404).json({ error: `No uses found for short URL ID ${urlId}` });
  } else {
    res.status(200).json({ data: useMetrics });
  }
});

app.put("/urls/:urlId/uses", (req, res) => {
  res.status(405).json({ error: "PUT method not allowed" });
});

app.post("/urls/:urlId/uses", (req, res) => {
  res.status(405).json({ error: "POST method not allowed" });
});

app.delete("/urls/:urlId/uses", (req, res) => {
  res.status(405).json({ error: "DELETE method not allowed" });
});






//PATH URLS/:URLID/USES/:USEID
app.get("/urls/:urlId/uses/:useId", (req, res) => {
  const urlId = parseInt(req.params.urlId);
  const useId = parseInt(req.params.useId);

  const use = usesData.find(use => use.id === useId && use.urlId === urlId);

  if (use) {
    res.json({ data: use });
  } else {
    if (!urlsData.find(url => url.id === urlId)) {
      res.status(404).json({ error: `URL id ${urlId} not found` });
    } else {
      res.status(404).json({ error: `Use id ${useId} not found` });
    }
  }
});

app.put("/urls/:urlId/uses/:useId", (req, res) => {
  const urlId = parseInt(req.params.urlId);
  const useId = parseInt(req.params.useId);
  const updatedUse = req.body.data;

  const useIndex = usesData.findIndex(use => use.id === useId && use.urlId === urlId);

  if (useIndex !== -1) {
    usesData[useIndex] = { ...usesData[useIndex], ...updatedUse };
    res.status(405).json({ error: "PUT method not allowed" });
  } else {
    res.status(404).json({ error: "Use not found" });
  }
});

app.post("/urls/:urlId/uses/:useId", (req, res) => {
  const urlId = parseInt(req.params.urlId);
  const useId = parseInt(req.params.useId);

  res.status(405).json({ error: "POST method not allowed" });
});

app.delete("/urls/:urlId/uses/:useId", (req, res) => {
  const useId = parseInt(req.params.useId);
  const useIndex = usesData.findIndex(use => use.id === useId);
  if (useIndex !== -1) {
    usesData.splice(useIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Use metric not found" });
  }
});






//PATH /USES
app.post("/uses", (req, res) => {
  res.status(405).json({ error: "POST method not allowed on /uses" });
});


app.get("/uses", (req, res) => {
  res.status(200).json({ data: usesData });
});

app.put("/uses", (req, res) => {
  res.status(405).json({ error: "PUT method not allowed" });
});

app.delete("/uses", (req, res) => {
  res.status(405).json({ error: "DELETE method not allowed" });
});






//PATH /USES/:USEID
app.post("/uses/:useId", (req, res) => {
  const useId = parseInt(req.params.useId);
  res.status(405).json({ error: "POST method not allowed" });
});


app.get("/uses/:useId", (req, res) => {
  const useId = parseInt(req.params.useId);
  const use = usesData.find(use => use.id === useId);
  if (use) {
    res.json({ data: use });
  } else {
    res.status(404).json({ error: `Use ${useId} not found` });
  }
});

app.put("/uses/:useId", (req, res) => {
  const useId = parseInt(req.params.useId);
  res.status(405).json({ error: "PUT method not allowed" });
});

app.delete("/uses/:useId", (req, res) => {
  const useId = parseInt(req.params.useId);
  const useIndex = usesData.findIndex(use => use.id === useId);
  if (useIndex !== -1) {
    usesData.splice(useIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Use metric not found" });
  }
});




app.use((req, res) => {
  res.status(404).json({ error: `${req.url}` });
});

app.use((err, req, res, next) => {
  res.status(405).json({ error: "Method Not Allowed" });
});

module.exports = app;
