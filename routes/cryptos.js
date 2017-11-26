var express = require('express')
var bodyParser = require('body-parser');
var router = express.Router()
var request = require('request')
var fs = require('fs')
const allCryptos = require("../public/data/allCryptos.json")

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }))

const COIN_MARKET_CAP_BASE = 'https://api.coinmarketcap.com'
const COIN_MARKET_CAP_ENDPOINT = '/v1/ticker'
const COIN_MARKET_CAP_URL = `${COIN_MARKET_CAP_BASE}${COIN_MARKET_CAP_ENDPOINT}`

const CRYPTO_COMPARE_API = 'https://www.cryptocompare.com/api/data'
const CRYPTO_COMPARE_MIN_API = 'https://min-api.cryptocompare.com/data'


router.get('/all', (req, res, next) => {
    res.send(allCryptos.Data)
})

router.get('/getpricebylist', (req, res, next) => {
    const fsyms = req.query.fromSymbols
    const tsyms = req.query.toSymbols
    const url = `${CRYPTO_COMPARE_MIN_API}/pricemultifull?fsyms=${fsyms}&tsyms=${tsyms}`
    console.log(url)
    
    request(url, (err, response, body) => {
        if (err) {
            console.log('Failer to fetch with err : ', err)
        } else if (response.statusCode == 200) {
            try{
                res.send(JSON.parse(body).RAW)    
            } catch (ex) {
                console.log('unable to getpricebylist with exception: ', ex)
            }
            
        }
    })
})

/* GET users listing. */
router.get('/', function(req, res, next) {

    const start = req.query.start
    const limit = req.query.limit
    const convert = req.query.convert

    let coinMarketCapUrl = `${COIN_MARKET_CAP_URL}/?start=${start}&limit=${limit}`
    console.log(coinMarketCapUrl)

    coinMarketCapUrl = convert ? `${coinMarketCapUrl}&convert=${convert}` : coinMarketCapUrl
    const cryptoMap = {}
    request(coinMarketCapUrl, (err, response, body) => {
        if (err) {
            console.log('Failer to fetch with err : ', err)
        } else if (response && response.statusCode === 200) {
            try{
                const result = JSON.parse(body)
                for(let crypto of result) {
                    cryptoMap[crypto.id] = crypto
                }
                res.send(cryptoMap)
            } catch (ex) {
                console.log('cannot fetch all cryptos with exception: ', ex)
            }
        }
    })
})

router.get('/:id', (req, res, next) => {
    const coinMarketCapUrl = `${COIN_MARKET_CAP_URL}/${req.params.id}`
    request(coinMarketCapUrl, (err, response, body) => {
        res.send(body)
    })
})

const queryCryptoJob = () => {
    const url = `${CRYPTO_COMPARE_API}/coinlist`
    request(url, (err, response, body) => {
        fs.writeFile('./public/data/allCryptos.json', body);
    })
}

module.exports = {
    router: router,
    queryCryptoJob: queryCryptoJob
}
