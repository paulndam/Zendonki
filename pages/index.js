import React, { useEffect } from "react";
import axios from "axios";
import ProductList from "../components/Index/ProductList";
import ProductPagination from "../components/Index/ProductPagination";

import baseUrl from "../utils/baseUrl";

function Home({ products, totalPages }) {
  return (
    <>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  );
}

// ====================================================>

// FETCHING DATA ON SERVER SIDE

Home.getInitialProps = async (ctx) => {
  const page = ctx.query.page ? ctx.query.page : "1";
  const size = 9;
  // fetch data on server
  const url = `${baseUrl}/api/products`;
  const payload = { params: { page, size } };
  const response = await axios.get(url, payload);
  // console.log(response.data);
  // return response data as an obj
  return response.data;
  // note : obj will be merged with existing props
};

export default Home;
