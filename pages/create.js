import React, { useEffect, useState } from "react";

import {
  Form,
  Input,
  TextArea,
  Button,
  Message,
  Icon,
  Header,
  Image,
} from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

const initialProduct = {
  name: "",
  price: "",
  media: "",
  description: "",
};

function CreateProduct() {
  const [product, setProduct] = useState(initialProduct);
  // preview for image
  const [mediaPreview, setMediaPreview] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const isProduct = Object.values(product).every((el) => Boolean(el));
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product]);

  function handleChange(e) {
    // e.preventDefault();
    const { name, value, files } = e.target;
    if (name === "media") {
      setProduct((prevState) => ({ ...prevState, media: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setProduct((prevState) => ({ ...prevState, [name]: value }));
      //console.log(product);
    }
  }

  async function imageUpload() {
    const data = new FormData();
    data.append("file", product.media);
    data.append("upload_preset", "zendonki");
    data.append("cloud_name", "hpk64ipuy");
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.url;
    return mediaUrl;
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);
      setError("");
      const mediaUrl = await imageUpload();
      console.log({ mediaUrl });
      const url = `${baseUrl}/api/product`;
      const { name, price, description } = product;
      const payload = { name, price, description, mediaUrl };
      const response = await axios.post(url, payload);
      //console.log(product);
      console.log(response);
      //setLoading(false);
      setProduct(initialProduct);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, setError);
      console.error(" YOU GOT AN ERROR MEN  🤬 🤬", error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="olive" />
        Creat New Product
      </Header>
      <Form
        loading={loading}
        error={Boolean(error)}
        success={success}
        onSubmit={handleSubmit}
      >
        <Message
          error
          header="ooops sorry, got some errors ! 😪 😰 🙁"
          content={error}
        />
        <Message
          success
          icon="check"
          header="success"
          content="your product has been submited and posted successfuly"
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            type="text"
            value={product.name}
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            min="0.00"
            step="0.01"
            type="number"
            value={product.price}
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="media"
            type="file"
            label="Media"
            accept="image/*"
            content="Select Image"
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="small" />
        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
        />
        <Form.Field
          control={Button}
          disabled={disabled || loading}
          color="blue"
          icon="pencil alternate"
          content="submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default CreateProduct;
