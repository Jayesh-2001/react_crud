import { useEffect, useState } from "react";

const Products = () => {
   const showList = () => {
      setContent(<ProductList showForm={showForm} />);
   }
   const showForm = (product) => {
      setContent(<ProductForm product={product} showList={showList} />);
   }
   const [content, setContent] = useState(<ProductList showForm={showForm} />);

   return (
      <div className="container my-5">
         {content}
      </div>
   );
}

const ProductList = (props) => {
   const [products, setProducts] = useState([]);

   const fetchProducts = async () => {
      try {
         const response = await fetch("http://localhost:3333/products");
         if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
         }
         const data = await response.json();
         setProducts(data);
      } catch (error) {
         console.log(`Error: ${error}`);
      }
   };

   useEffect(() => { fetchProducts() }, []);

   const deleteProduct = (id) => {
      fetch(`http://localhost:3333/products/${id}`, {
         method: "DELETE",
      })
         .then((response) => response.json())
         .then(() => fetchProducts());
   }

   return (
      <>
         <h2 className="text-center mb-3">Available Products</h2>
         <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Create</button>
         <button onClick={fetchProducts} type="button" className="btn btn-outline-primary me-2">Refresh</button>
         <table className="table">
            <thead>
               <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
               </tr>
            </thead>
            <tbody>
               {
                  products.map((product, index) => (
                     <tr key={index}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.brand}</td>
                        <td>{product.category}</td>
                        <td>₹ {product.price}</td>
                        <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                           <button onClick={() => props.showForm(product)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                           <button onClick={() => deleteProduct(product.id)} type="button" className="btn btn-danger btn-sm">Delete</button>
                        </td>
                     </tr>
                  ))
               }
            </tbody>
         </table>
      </>
   )
}


const ProductForm = (props) => {
   const [errMessage, setErrMessage] = useState("");

   const handleSubmit = (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const product = Object.fromEntries(formData.entries());

      if (!product.name || !product.brand || !product.category || !product.price) {
         setErrMessage(
            <div class="alert alert-warning" role="alert">
               Please fill all the fields!
            </div>
         );
         return;
      }

      if (props.product.id) {
         fetch("http://localhost:3333/products/" + props.product.id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
         })
            .then((response) => {
               if (!response.ok) {
                  throw new Error(response.statusText);
               }
               return response.json();
            })
            .then((data) => props.showList())
            .catch((error) => {
               console.error(`Error: ${error}`)
            });
      } else {

         fetch("http://localhost:3333/products", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
         })
            .then((response) => {
               if (!response.ok) {
                  throw new Error(response.statusText);
               }
               return response.json();
            })
            .then((data) => props.showList())
            .catch((error) => {
               console.error(`Error: ${error}`)
            });
      }
   }

   return (
      <>
         <h2 className="text-center mb-3">{(props.product.id) ? "Edit product!" : "Add new product"}</h2>
         <div className="row">
            <div className="col-mg-6 mx-auto">
               {errMessage}
               <form onSubmit={(event) => handleSubmit(event)}>
                  {
                     props.product.id && <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">ID</label>
                        <div className="col-sm-6">
                           <input readOnly name="id" defaultValue={props.product.id} className="form-control-plaintext" />
                        </div>
                     </div>
                  }
                  <div className="row mb-3">
                     <label className="col-sm-3 col-form-label">Name</label>
                     <div className="col-sm-6">
                        <input name="name" defaultValue={props.product.name} className="form-control" />
                     </div>
                  </div>
                  <div className="row mb-3">
                     <label className="col-sm-3 col-form-label">Brand</label>
                     <div className="col-sm-6">
                        <input name="brand" defaultValue={props.product.brand} className="form-control" />
                     </div>
                  </div>
                  <div className="row mb-3">
                     <label className="col-sm-3 col-form-label">Category</label>
                     <div className="col-sm-6">
                        <select name="category" defaultValue={props.product.category} className="form-select mb-3">
                           <option value="Other">Other</option>
                           <option value="Mobile">Mobile</option>
                           <option value="Laptop">Laptop</option>
                           <option value="Accessories">Accessories</option>
                           <option value="Camera">Camera</option>
                        </select>
                     </div>
                  </div>
                  <div className="row mb-3">
                     <label className="col-sm-3 col-form-label">Price</label>
                     <div className="col-sm-6">
                        <input name="price" defaultValue={props.product.price} className="form-control" />
                     </div>
                  </div>
                  <div className="row">
                     <div className="offset-sm-3 col-sm-3 d-grid">
                        <button type="submit" className="btn btn-primary btn-sm me-3">Save</button>
                     </div>
                     <div className="col-sm-3 d-grid">
                        <button onClick={() => props.showList()} type="button" className="btn btn-secondary me-2">cancel</button>
                     </div>
                  </div>
               </form>

            </div>
         </div>
      </>
   )
}

export { Products };

/*
 {
      "id": "j3v9",
      "name": "Galaxy M51",
      "brand": "Samsung",
      "category": "Mobile",
      "price": "24,999"
    }
*/