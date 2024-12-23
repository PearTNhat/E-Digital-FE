import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineCamera } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct, updateProductColor } from "~/apis/product";
import InputForm from "~/components/InputForm";
import Loading from "~/components/Loading";
import { appActions } from "~/store/slice/app";
import { Toast } from "~/utils/alert";
import { toBase64 } from "~/utils/helper";

function EditProductColor() {
  const { slug, colorId } = useParams();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const { accessToken } = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [color, setColor] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const fetProduct = async () => {
    const response = await getProduct({ slug });
    if (response.success) {
      setProduct(response.data);
      setColor(response.data.colors.find((item) => item._id === colorId));
    }
  };
  const handleUpdateProductColor = async (data) => {
    const formData = new FormData();
    formData.append(
      "primaryImage",
      data.thumb?.length > 0 ? data.thumb[0] : null
    );
    if (data.images?.length > 0) {
      for (let image of data.images) {
        formData.append("images", image);
      }
    } else {
      formData.append("images", null);
    }
    formData.append(
      "document",
      JSON.stringify({ color: data.color, quantity: data.quantity })
    );
    dispatch(
      appActions.toggleModal({ isShowModal: true, childrenModal: <Loading /> })
    );
    const response = await updateProductColor({
      accessToken: accessToken,
      slug,
      formData,
      params: { colorId },
    });
    dispatch(
      appActions.toggleModal({ isShowModal: false, childrenModal: null })
    );
    if (response.success) {
      return Toast.fire({
        icon: "success",
        title: "Update product color successfully",
      });
    } else {
      return Toast.fire({ icon: "error", title: response.message });
    }
  };
  useEffect(() => {
    fetProduct();
  }, []);
  useEffect(() => {
    reset({
      color: color?.color || "",
      quantity: color?.quantity || 0,
    });
    setThumbPreview(color?.primaryImage?.url);
    setImagesPreview(color?.images?.map((item) => item.url));
  }, [product]);
  const handleThumbToPreview = async (file) => {
    const preview = await toBase64(file);
    setThumbPreview(preview);
  };
  const handleImagesPreview = async (files) => {
    const listPreviews = [];
    for (let file of files) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type))
        return Toast.fire({
          icon: "warning",
          title: "Image is in wrong format.",
        });
      const preview = await toBase64(file);
      listPreviews.push(preview);
    }
    setImagesPreview(listPreviews);
  };
  useEffect(() => {
    if (watch("thumb")?.length > 0) {
      handleThumbToPreview(watch("thumb")[0]);
    }
  }, [watch("thumb")]);
  useEffect(() => {
    if (watch("images")?.length > 0) {
      handleImagesPreview(watch("images"));
    }
  }, [watch("images")]);
  return (
    <div className="h-screen overflow-auto">
      <h1 className="text-2xl font-medium">
        Cập nhật màu sản phẩm: {color?.color}
      </h1>
      <form onSubmit={handleSubmit(handleUpdateProductColor)}>
        <div className="flex gap-4">
          <InputForm
            cssParents={"mt-3"}
            id="color"
            validate={{ required: "This input is required." }}
            label="Color"
            register={register}
            error={errors}
          />
          <InputForm
            cssParents={"mt-3"}
            id="quantity"
            validate={{
              required: "This input is required.",
              min: { value: 1, message: "Quantity must be greater than 0" },
            }}
            label="Quantity"
            register={register}
            error={errors}
          />
        </div>
        <div className="flex">
          <div className="mt-3 border-r-2 border-gray-300 pr-3">
            <span>Ảnh đại diện</span>
            <div className="">
              <div className="relative w-[100px] h-[100px] outline outline-1 rounded-md overflow-hidden">
                <label
                  htmlFor="profilePicture"
                  className="absolute inset-0 cursor-pointer rounded-md bg-transparent"
                >
                  {thumbPreview ? (
                    <img
                      src={thumbPreview}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary bg-blue-50/50">
                      <HiOutlineCamera className="w-8 h-auto" />
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  {...register("thumb")}
                  className="sr-only"
                />
              </div>
              {errors["thumb"] && (
                <small className="text-red-500">
                  {errors["thumb"].message}
                </small>
              )}
            </div>
          </div>
          {/* image */}
          <div className="my-3 pl-3">
            <span className="">Chọn ảnh (có thể chọn nhiều ảnh)</span>
            <div className="flex gap-3 flex-wrap">
              <div className="">
                <div className="relative outline h-[200px] w-[200px] outline-1 rounded-md overflow-hidden">
                  <label
                    htmlFor="images"
                    className="absolute inset-0 cursor-pointer rounded-md bg-transparent"
                  >
                    <div className="w-full h-full flex items-center justify-center text-primary bg-blue-50/50">
                      <HiOutlineCamera className="w-8 h-auto" />
                    </div>
                    s
                  </label>
                  <input
                    type="file"
                    multiple="multiple"
                    id="images"
                    {...register("images")}
                    className="sr-only"
                  />
                </div>
                {errors["images"] && (
                  <small className="text-red-500">
                    {errors["images"].message}
                  </small>
                )}
              </div>
              {imagesPreview?.length > 0 &&
                imagesPreview.map((image) => (
                  <div
                    className="flex w-[200px] h-[200px] outline outline-1 rounded-md overflow-hidden"
                    key={image}
                  >
                    <img
                      src={image}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="my-3 flex justify-center">
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-md"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProductColor;
