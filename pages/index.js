import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../comfig'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFT.sol/NFTMarket.json'
import axios from 'axios'

export default function Home() {
    const [nfts, serNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        const provider =new ethers.provider.JsonRpcProvider
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi , provider)
        const data = await marketContract.fetcMarketItems()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenUri(i.tolenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.name,
                description: meta.data.description,

            }
            return item
        }))
        setNfts(items)
        setLoadingState('loaded')
    }

    async function buyNft(nft) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.provider.Web3Provider(connection)

        const signer = provider.getSigner()
        const contract = new ethers.Contract(nftmarketaddress, Market.abi , signer)

        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    
        const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
            value: price
        })
        await transaction.wait()
        loadNFTs()
    }

    if(loadingState === 'loaded' && !nfts.length) return (
        <h1 className="px-20 py-10  text-3xl">No item in Marketplace</h1>)

    return (
        <div className="flex justify-center">
            <dev className="px-4" style={{ maxWidth: '1600px'}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="border shadow rounded-xl overflow-hidden">
                                <img src= {nft.image} />
                                <div className="p-4">
                                    <p style={{ height:'64px'}} className="text-2xl font-semibold">{nft.name}</p>
                                    <div style={{ height: '70px', overflow: 'hidden'}}>
                                        <p className="text-gray-400">{nft.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </dev>
        </div>
    )
}

