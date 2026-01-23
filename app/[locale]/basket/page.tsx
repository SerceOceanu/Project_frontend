import OrdersCard from "./conponents/OrdersCard";
import Form from "./conponents/Form";

export default async function Basket() {
  return (
    <div className='grid cols-1 lg:grid-cols-2 gap-6 pt-[140px] md:pt-[190px] px-4 md:px-10 xl:px-[100px] container pb-[130px]'>
      <div className='col-span-1'>
        <Form />
      </div>
      <div className='col-span-1'>
        <OrdersCard type="page" />
      </div>
    </div>
  );
}
