// import DailyDeals from "./component/DailyDeals"
import Featured from "./component/Featured"
import { bannerImages,logoImages } from "~/constants/images"
import ListProduct from "./component/ListProduct"
import SideBar from "./component/SideBar"
import CustomSliceStatic from "~/components/CustomSliceStatic"
import HotCollections from "./component/HotCollections"
function Home() {
  return (
    <div className="main-container">
      <div className="flex mt-3 gap-4">
        <SideBar />
        <CustomSliceStatic images={bannerImages} className={'flex-1 h-full'}/>
      </div>
      <div className="flex">
        {/* <DailyDeals /> */}
        <ListProduct />
      </div>
      <Featured/> 
      <HotCollections/>
      <CustomSliceStatic images={logoImages} className={''} options={{ slidesToShow: 5}}/>
    </div>
  ) 
}

export default Home