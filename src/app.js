import React from 'react'
import { render } from 'react-dom'
import { promisifyAll } from 'bluebird'
import abi from './abi.js'
import './index.styl'

class App extends React.Component {
    constructor() {
        super()
        window.web3 = new Web3(web3.currentProvider)
        window.contractInstance = web3.eth.contract(abi).at("0xf1845b04141798d58a08b5ad15f31c5a80810c91")
        promisifyAll(contractInstance)
        promisifyAll(web3)
        this.state = {
            products: [],
            showProducts: [],
            showAddProduct: false,
            newProductTitle: '',
            newProductDescription: '',
            newProductPrice: '',
            lastId: 0
        }
    }

    componentDidMount() {
        this.setInitialProducts()
    }

    async setInitialProducts() {
        // Get all the products from the smart contract
        // Get the last id, loop over all the products, only return the products on sale
        const lastId = (await contractInstance.lastIdAsync()).toNumber()
        let products = []
        for(let i = 0; i < lastId; i++) {
            let myProduct = await contractInstance.productsAsync(i)

            // If this product is not on sale, don't add it to the list
            if(!myProduct[5]) continue

            products.push({
                title: myProduct[1],
                description: myProduct[2],
                price: myProduct[3].toString(),
                owner: myProduct[4],
                id: myProduct[0].toNumber()
            })
        }
        this.setState({
            products: products,
            lastId: lastId
        }, () => this.updateProducts())
    }

    async publishProduct() {
        const product = {
            title: this.state.newProductTitle,
            description: this.state.newProductDescription,
            price: this.state.newProductPrice
        }

        await contractInstance.uploadProductAsync(product.title, product.description, product.price)

        this.updateProducts()
    }

    async buyProduct(id, price) {
        await contractInstance.buyProductAsync(id, {value: web3.toWei(price)})
    }

    resetNewProduct() {
        this.refs['newProductTitle'].value = ''
        this.refs['newProductDescription'].value = ''
        this.refs['newProductPrice'].value = ''
        this.setState({
            showAddProduct: false,
            newProductTitle: '',
            newProductDescription: '',
            newProductPrice: ''
        })
    }

    updateProducts() {
        let products = []
        products = this.state.products.map(product => (
            <Product
                title={product.title}
                description={product.description}
                price={product.price}
                id={product.id}
                buyProduct={(id, price) => {
                    this.buyProduct(id, price)
                }}
            />
        ))
        this.setState({showProducts: products})
    }

    render() {
        return(
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6 main-block">
                        {/* This is the add product block */}
                        <div>
                            <button onClick={() => {
                                this.setState({showAddProduct: !this.state.showAddProduct})
                            }}>Add product</button>
                            <div className={this.state.showAddProduct ? 'container-fluid add-product-block' : 'hide'}>
                                <div className="row">
                                    <div className="col-6 align-center">Title:</div>
                                    <div className="col-6 align-center">
                                        <input ref="newProductTitle" type="text" onChange={(e) => {
                                            this.setState({newProductTitle: e.target.value})
                                        }} />
                                    </div>
                                </div>
                                <div className="row margin-top">
                                    <div className="col-6 align-center">Description:</div>
                                    <div className="col-6 align-center"><textarea ref="newProductDescription" onChange={(e) => {
                                        this.setState({newProductDescription: e.target.value})
                                    }} ></textarea></div>
                                </div>
                                <div className="row margin-top">
                                    <div className="col-6 align-center">Price:</div>
                                    <div className="col-6 align-center"><input type="number" ref="newProductPrice" onChange={(e) => {
                                        this.setState({newProductPrice: e.target.value})
                                    }} /></div>
                                </div>
                                <div className="row margin-top">
                                    <div className="col-6 align-center"><button onClick={() => this.resetNewProduct()}>Cancel</button></div>
                                    <div className="col-6 align-center"><button onClick={() => {
                                        this.publishProduct()
                                        this.resetNewProduct()
                                    }}>Publish product</button></div>
                                </div>
                            </div>
                        </div>

                        {/* This is where the products will be shown */}
                        <h1>Products on sale</h1>
                        <div className="container">
                            <div className="row">
                                {this.state.showProducts}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Product extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="col-4">
                <img src="planta.jpg" className="full-width" />
                <h3>{this.props.title}</h3>
                <p>{this.props.description}</p>
                <b>{this.props.price} ETH</b>
                <div>
                    <button className="full-width" onClick={() => {
                        this.props.buyProduct(this.props.id, this.props.price)
                    }}>Buy now</button>
                </div>
            </div>
        )
    }
}

render(<App/>, document.querySelector('#root'))
