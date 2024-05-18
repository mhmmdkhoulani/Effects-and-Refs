import { useEffect, useRef, useState } from "react";
import "./index.css";

function App() {
  const [counter, setCounter] = useState(0);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const counterRef = useRef(0);
  const inputRef = useRef(null);
  let counterVar = 0;

  useEffect(function () {
    inputRef.current.focus();
  }, []);

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
        <ProductTable products={products}></ProductTable>
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

function ProductTable({ products }) {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Title</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Image</th>
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
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default App;
