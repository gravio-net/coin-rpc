const express = require("express");
const router = express.Router();
var request = require("request");

const dotenv = require("dotenv");
dotenv.config();

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;

const headers = {
  "content-type": "text/plain;",
  "Access-Control-Allow-Origin": '*'
};


function getheight(a, callback) {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockchaininfo","params":[]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:28273/`,
    method: "POST",
    headers: headers,
    body: dataString
  };
  cb = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      const blocks = data["result"]["blocks"];
      callback(blocks);
    }
  };
  request(options, cb);

}

function getblockhash(block, callback) {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockhash","params":[${block}]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:28273/`,
    method: "POST",
    headers: headers,
    body: dataString
  };
  cb = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      const hash = data["result"];
      callback(hash);
    }
  };
  request(options, cb);

}

function getblock(hash, callback) {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblock","params":["${hash}"]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:28273/`,
    method: "POST",
    headers: headers,
    body: dataString
  };
  cb = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      const block = data["result"]
      callback(block);
    }
  };
  request(options, cb);

}

function getrawtransaction(hash, callback) {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getrawtransaction","params":["${hash}"]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:28273/`,
    method: "POST",
    headers: headers,
    body: dataString
  };
  cb = (error, response, body) => {
    //console.log(error)
    //console.log(response)
    //console.log(body)
    if (!error && response.statusCode == 200) {
      //console.log("try to send some")
      const data = JSON.parse(body);
      const rawtx = data["result"]
      //console.log(block)
      callback(rawtx, false);
    }
    else {
      callback("", true);
    }
  };
  request(options, cb);

}

function decoderawtransaction(rawtx, callback) {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"decoderawtransaction","params":["${rawtx}"]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:28273/`,
    method: "POST",
    headers: headers,
    body: dataString
  };
  cb = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      const tx = data["result"]
      callback(tx, false);
    }
    else {
      callback("", true);
    }
  };
  request(options, cb);

}

router.get("/test", (req, res) => res.json({ msg: "backend works" }));

router.get("/getblockchaininfo", (req, res) => {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockchaininfo","params":[]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:28273/`,
    method: "POST",
    headers: headers,
    body: dataString
  };
  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.set('Access-Control-Allow-Origin', '*');
      res.send(data);
    }
  };
  request(options, callback);
});

router.get("/getpeerinfo", (req, res) => {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getpeerinfo","params":[]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:28273/`,
    method: "POST",
    headers: headers,
    body: dataString
  };
  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.set('Access-Control-Allow-Origin', '*');
      res.send(data);
    }
  };
  request(options, callback);
});

router.get("/getlastblocks", (req, res) => {
  getheight(0, (blocks) => {
    //console.log(blocks);
    result = { "result": [] }
    for(let i=blocks-5; i<=blocks; i++) {
      getblockhash(i, (hash) => {
        getblock(hash, (block) => {
          //console.log(result);
          var date = new Date(block["time"] * 1000)
          result["result"].push({ "id": i, "hash": hash, "time": date.toGMTString() });
          result["result"].sort((a, b) => { return a["id"] < b["id"] ? 1 : -1 })
          if(i == blocks) res.send(result);
        });
        //console.log(i);
      });
    }
    //console.log("get last blocks done");
  });
});


router.get("/gettransaction/:txid", (req, res) => {
  //res.json({ msg: req.params["txid"] })
  //console.log(req.params["txid"])
  getrawtransaction(req.params["txid"], (rawtx, error) => {
    //console.log("gettx result");
    if(error) {
      //console.log("raw tx null");
      res.json({ error: true });
    }
    else {
      decoderawtransaction(rawtx, (tx) => {
        res.send(tx)
      });
      //res.json({ msg: rawtx });
    }
  });
});

module.exports = router;

