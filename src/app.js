import React from 'react'
import { render } from 'react-dom'
import { promisifyAll } from 'bluebird'
import './index.styl'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            products: [],
            showProducts: [],
            showAddProduct: false,
            newProductTitle: '',
            newProductDescription: '',
            newProductPrice: ''
        }
    }

    componentDidMount() {
        this.setInitialProducts()
    }

    setInitialProducts() {
        this.setState({
            products: [{
                title: 'Weed Plant For Home Use',
                description: 'This is the best plant that you\'ll find for satisfying your medicinal needs and to calm yourself',
                price: '29.95'
            }, {
                title: 'Organic Tomato Plant',
                description: 'Grow your own healthy tomatos with this all natural plant that will provide you with tons of vegetables',
                price: '34.95'
            }, {
                title: 'Organic Watermelon Plant',
                description: 'This is the best watermelon plant on the market to grow your own healthy watermelons for the summer',
                price: '19.95'
            }]
        }, () => this.updateProducts())
    }

    publishProduct() {
        const product = {
            title: this.state.newProductTitle,
            description: this.state.newProductDescription,
            price: this.state.newProductPrice
        }

        this.setState(prevState => ({
            products: [product, ...prevState.products]
        }), () => this.updateProducts())
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
                <b>{this.props.price}€</b>
                <div>
                    <button className="full-width">Buy now</button>
                </div>
            </div>
        )
    }
}

render(<App/>, document.querySelector('#root'))
