import moment from "moment";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { apiGetOrdersUser } from "~/apis/order";
import Select from "react-select";
import InputField from "~/components/InputField";
import Pagination from "~/components/Pagination";
import { useDebounce } from "~/hook/useDebounce";
import { formatNumber } from "~/utils/helper";
const status = [
  { value: "Pending", label: "Pending" },
  { value: "Succeed", label: "Succeed" },
  { value: "Cancelled", label: "Cancelled" },
];
function Order() {
  const { accessToken } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [filter, setFilter] = useState({
    title: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  const debounceSearch = useDebounce(filter.title, 500);
  const fetchOrderUser = async (params) => {
    const response = await apiGetOrdersUser({ accessToken, params });
    if (response?.success) {
      const totalPage = Math.ceil(response.counts / 10) || 1;
      if (totalPage < currentPage) {
        setCurrentPage(currentPage - 1);
      }
      setOrders(response.data);
      setTotalPageCount(totalPage);
    }
  };
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      title: filter.title,
      status: filter.status,
    };
    fetchOrderUser(params);
  }, [currentParams]);
  useEffect(() => {
    setSearchParams({
      ...currentParams,
      page: currentPage,
      title: debounceSearch,
      status: filter.status || "",
    });
  }, [currentPage, debounceSearch, filter.status]);
  return (
    <div className="h-screen overflow-auto">
      <div className="bg-gray-100 h-[60px]">
        <h1 className="text-2xl font-semibold p-3">Quản lý đơn hàng</h1>
      </div>
      <div className="">
        <form className="flex gap-3 justify-end px-2">
          <InputField
            type="text"
            cssDiv="!mb-0"
            placeholder={"Tìm kiếm tên sản phẩm"}
            className="px-4 py-[0.625rem] border-gray-300 border-[1px] rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => {
              let value = e.target.value;
              if (value.startsWith(" ")) {
                value = value.trim();
              }
              setFilter((prev) => ({ ...prev, title: value }));
            }}
          />
          <Select
            className="z-50"
            isClearable
            isSearchable
            options={status}
            onChange={(data) => {
              setFilter((prev) => ({ ...prev, status: data?.value }));
            }}
          />
        </form>
      </div>
      <div className="p-2">
        <table className="w-full table-auto ">
          <thead>
            <tr className="border border-gray-300 bg-blue-900 text-white text-sm">
              <th className="p-2">#</th>
              <th className="p-2">Ảnh</th>
              <th className="p-2">Tên</th>
              <th className="p-2">Địa chỉ</th>
              <th className="p-2">Số lượng</th>
              <th className="p-2">Giá</th>
              <th className="p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => {
              return (
                <Fragment key={order._id}>
                  <tr className="font-semibold text-blue-500">
                    <td colSpan="6" className="p-2 ">
                      <p>
                        <span className="inline-block mr-3">
                          Ngày: {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
                        </span>
                        <span className="text-black">
                          Địa chỉ: {order.address}
                        </span>
                      </p>
                    </td>
                  </tr>
                  <>
                    {order.products.map((p, idx) => {
                      const color = p.product.colors.find(
                        (color) =>
                          color.color.toLowerCase() === p.color.toLowerCase()
                      );
                      return (
                        <tr key={p._id} className="border border-gray-300 ">
                          <td className="p-2">{idx + 1}</td>
                          <td className="p-2">
                            <Link to={`/${p.product.slug}`}>
                              <img
                                src={ p.product.primaryImage.url}
                                className="w-[100px]"
                                alt=""
                              />
                            </Link>
                          </td>
                          <td className="p-2">
                            {p.product.title} - {color.color}
                          </td>
                          <td className="p-2 text-center">{p.quantity}</td>
                          <td className="p-2">{p.product.discountPrice}</td>
                          <td className="p-2">
                            <p
                              className={`${
                                p.status === 0
                                  ? "text-yellow-400"
                                  : "text-green-500"
                              }`}
                            >
                              {p.status}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                  <tr>
                    <td colSpan="7" className="border border-gray-300 p-2">
                      <span className="font-semibold">Tổng cộng:</span>{" "}
                      <span className="text-main">
                        {formatNumber(order.total)} ₫
                      </span>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2 mb-6">
        <Pagination
          totalPageCount={totalPageCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Order;
