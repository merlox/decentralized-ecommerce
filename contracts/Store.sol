pragma solidity 0.4.23;

contract Store {
  // Products
  // A function to store those products
  // Some way to get products
  struct Product {
    uint256 id;
    string title;
    string description;
    uint256 price; // The price is set in ETHer
    address owner;
    bool onSale;
  }

  mapping(uint256 => Product) public products;
  mapping(address => uint256[]) public productsOwned;
  uint256 public lastId = 0;

  // Uploads a product to the list of products of the store
  function uploadProduct(string _title, string _description, uint256 _price) public returns(uint256) {
    require(bytes(_title)[0] != 0);
    require(bytes(_description)[0] != 0);
    require(_price > 0);

    Product memory myProduct = Product(lastId, _title, _description, _price, msg.sender, true);
    products[lastId] = myProduct;

    lastId++;
    return (lastId - 1);
  }

  // To buy a product with ether
  function buyProduct(uint256 _id) public payable {
    // First the owner of that product loses the id
    // Then the buyer gets the new id in the mapping
    // Check that the price of the product is <= the amount sent
    require(msg.value >= products[_id].price);
    require(msg.sender != products[_id].owner);
    require(products[_id].onSale);

    // Return the exceeding amount to the owner if we are in that case
    if(msg.value > products[_id].price) {
      uint256 amountToRefund = msg.value - products[_id].price;
      msg.sender.transfer(amountToRefund);
    }

    delete productsOwned[products[_id].owner][_id];
    productsOwned[msg.sender].push(_id);
    products[_id].owner = msg.sender;
    products[_id].onSale = false;
  }
}
