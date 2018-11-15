const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const Blockchain = require('./simpleChain.js')

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} server 
     */
    constructor(server) {
        this.server = server;
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
        this.myBlockChain = new Blockchain.Blockchain();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/api/block/{index}',
            handler: async (request, h) => {
                let myBlockChain = new Blockchain.Blockchain();
                let blockIndex = (parseInt(request.params.index));
                const result = await this.myBlockChain.getBlock(blockIndex);         
                //console.log("logging",typeof(result));   
                return result;
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/api/block',
            handler: async (request, h) => {
                if (request.payload !== null && request.payload.body !== undefined && request.payload.body !== "")
                {
                    const result = await this.myBlockChain.addBlock(new BlockClass.Block(request.payload.body));
                    return result;                                   
                }
                return "An Entry For 'Body' Is Necessary To Create New Block";
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }
}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}