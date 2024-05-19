import { useEffect, useRef, useState } from "react";
import "./index.css";

function App() {
  const [counter, setCounter] = useState(0);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const counterRef = useRef(0);
  const inputRef = useRef(null);
  let counterVar = 0;

  useEffect(function () {
    inputRef.current.focus();
  }, []);

  function selectAProduct(product) {
    setSelectedProduct(product);
  }

  function AddCounter() {
    counterVar++;
    counterRef.current++;
    console.log("Var", counterVar);
    console.log("Ref", counterRef.current);
  }
  function handleSearch(e) {
    e.preventDefault();
    let search = e.target.search.value;
    setQuery(search);
  }
  async function getData() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://dummyjson.com/products/search?q=${query}`
      );
      const data = await res.json();
      setProducts(data.products);
      if (!res.ok) throw new Error("Something went wrong");
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(
    function () {
      getData();
    },
    [query]
  );

  return (
    <div className="container">
      <form onSubmit={handleSearch}>
        <h2>Search</h2>
        <input
          ref={inputRef}
          type="text"
          className="form-control my-4"
          name="search"
          placeholder="Search for product"
        />
      </form>
      {isLoading ? <Loader /> : ""}

      {err ? (
        <ErrorMessage message={err} />
      ) : (
        <div className="row">
          <div className="col-md-8">
            <ProductTable
              products={products}
              handleSelectProduct={selectAProduct}
            ></ProductTable>
          </div>
          <div className="col-md-4">
            <SingleProduct product={selectedProduct} />
          </div>
        </div>
      )}

      <button className="btn btn-danger" onClick={AddCounter}>
        Count
      </button>
    </div>
  );
}

function Loader() {
  return (
    <img src="gears-spinner.svg" alt="Loader" style={{ width: "200px" }} />
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="alert alert-danger" role="alert">
      {message}
    </div>
  );
}

function ProductTable({ products, handleSelectProduct }) {
  function selectProduct(product) {
    handleSelectProduct(product);
  }
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Title</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.length <= 0 ? (
          <div className="alert alert-info" role="alert">
            No products
          </div>
        ) : (
          products.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.brand}</td>
              <td>${product.price}</td>
              <td>
                <img
                  src={product.thumbnail}
                  alt="i"
                  style={{ width: "100px" }}
                />
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => selectProduct(product)}
                >
                  Show Details
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function SingleProduct({ product }) {
  return (
    <div>
      {product !== null ? (
        <div>
          <img src={product.thumbnail} alt="productimage" />
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>
      ) : (
        " "
      )}
    </div>
  );
}

export default App;
