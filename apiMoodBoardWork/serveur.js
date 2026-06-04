// serveur.js — mini-proxy local pour lire les flux RSS Pinterest
// Lancer avec : node serveur.js

import http from "node:http";
import https from "node:https";

const PORT = 3000;

// Va chercher une URL en suivant les redirections (max 5)
function fetchUrl(url, redirectsLeft, callback) {
  https.get(url, {
    headers: {
      // On se fait passer pour un vrai navigateur, sinon Pinterest peut refuser
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept": "application/rss+xml, application/xml, text/xml, */*"
    }
  }, (response) => {
    const status = response.statusCode;
    console.log("-> " + url + "  (statut " + status + ")");

    // Redirection ?
    if (status >= 300 && status < 400 && response.headers.location) {
      if (redirectsLeft === 0) {
        callback(new Error("Trop de redirections"), null);
        return;
      }
      let next = response.headers.location;
      // Si la redirection est relative, on la complète
      if (next.startsWith("/")) {
        const u = new URL(url);
        next = u.origin + next;
      }
      console.log("   redirige vers " + next);
      fetchUrl(next, redirectsLeft - 1, callback);
      return;
    }

    let data = "";
    response.on("data", (chunk) => (data += chunk));
    response.on("end", () => callback(null, data));
  }).on("error", (err) => callback(err, null));
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const urlObj = new URL(req.url, "http://localhost:" + PORT);

  if (urlObj.pathname !== "/rss") {
    res.writeHead(404);
    res.end("Utilise /rss?url=...");
    return;
  }

  const target = urlObj.searchParams.get("url");
  if (!target) {
    res.writeHead(400);
    res.end("Parametre url manquant");
    return;
  }

  fetchUrl(target, 5, (err, data) => {
    if (err) {
      console.error("Erreur fetch :", err.message);
      res.writeHead(500);
      res.end("Erreur : " + err.message);
      return;
    }
    // On affiche le tout début de ce qu'on a reçu, pour diagnostic
    console.log("   reçu (100 premiers caractères) : " + data.slice(0, 100).replace(/\n/g, " "));
    res.writeHead(200, { "Content-Type": "text/xml; charset=utf-8" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log("Mini-proxy lance sur http://localhost:" + PORT);
  console.log("Laisse ce terminal ouvert. Ctrl+C pour arreter.");
});

process.on("uncaughtException", (err) => {
  console.error("Erreur non capturée :", err);
});