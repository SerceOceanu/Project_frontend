"use client";
import CustomSelect from "@/components/CustomSelect";
import { useState } from "react";
import NoOrders from "./components/NoOrders";
import OrderItem from "./components/OrderItem";
import Paggination from "@/components/Paggination";
export default function History() {
  const [step, setStep] = useState(0);
  const itemsPerPage = 5;
  const pageCount = Math.ceil(orders.length / itemsPerPage);
  
  if(orders.length === 0) return <NoOrders />
  
  const startIndex = step * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-5">
        <CustomSelect
          options={[{ label: 'All', value: 'all' }, { label: 'Pending', value: 'pending' }, { label: 'Completed', value: 'completed' }]}
          placeholder="Select Status"
          value="all"
          onChange={(value) => {}}
        />
        <div className="flex flex-col gap-2.5 min-h-[482px]">
        {currentOrders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
        <Paggination 
          currentPage={step}
          setCurrentPage={setStep}
          pageCount={pageCount}
        />
      </div>
    </div>
  );
} 

const orders = [

  {
    id: 2,
    date: '2025-01-02',
    total: 500,
    status: 'completed',
    products: [
      {
        id: 2,
        name: 'Product 2',
        price: 200,
        weight: 289,
        quantity: 2,
      },
      {
        id: 3,
        name: 'Product 3',
        price: 300,
        weight: 389,
        quantity: 3,
      },
      {
        id: 4,
        name: 'Product 4',
        price: 400,
        weight: 489,
        quantity: 4,
      },
      {
        id: 5,
        name: 'Product 5',
        price: 500,
        weight: 589,
        quantity: 5,
      },
      {
        id: 6,
        name: 'Product 6',
        price: 600,
        weight: 689,
        quantity: 6,
      },  
      {
        id: 7,
        name: 'Product 7',
        price: 700,
        weight: 789,
        quantity: 7,
      },
      {
        id: 8,  
        name: 'Product 8',
        price: 800,
        weight: 889,
        quantity: 8,
      },
    ],
  },
  {
    id: 3,
    date: '2025-01-03',
    total: 750,
    status: 'pending',
    products: [
      {
        id: 3,
        name: 'Product 3',
        price: 300,
        weight: 389,
        quantity: 3,
      },
    ],
  },
  {
    id: 4,
    date: '2025-01-04',
    total: 1200,
    status: 'completed',
    products: [
      {
        id: 4,
        name: 'Product 4',
        price: 400,
        weight: 489,
        quantity: 4,
      },
    ],
  },
  {
    id: 5,
    date: '2025-01-05',
    total: 890,
    status: 'pending',
    products: [
      {
        id: 5,
        name: 'Product 5',
        price: 500,
        weight: 589,
        quantity: 5,
      },
    ],
  },
  {
    id: 6,
    date: '2025-01-06',
    total: 650,
    status: 'completed',
    products: [
      {
        id: 6,
        name: 'Product 6',
        price: 600,
        weight: 689,
        quantity: 6,
      },
    ],
  },
  {
    id: 7,
    date: '2025-01-07',
    total: 1100,
    status: 'pending',
    products: [
      {
        id: 7,
        name: 'Product 7',
        price: 700,
        weight: 789,
        quantity: 7,
      },
    ],
  },
  {
    id: 8,
    date: '2025-01-08',
    total: 950,
    status: 'completed',
    products: [
      {
        id: 8,
        name: 'Product 8',
        price: 800,
        weight: 889,
        quantity: 8,
      },
    ],
  },
  {
    id: 1,
    date: '2025-01-01',
    total: 1000,
    status: 'pending',
    products: [
      {
        id: 1,
        name: 'Product 1',
        price: 100,
        weight: 159,
        quantity: 1,
      },
      {
        id: 2,
        name: 'Product 2',
        price: 200,
        weight: 289,
        quantity: 2,
      },
    ],    
  },
  {
    id: 2,
    date: '2025-01-02',
    total: 500,
    status: 'completed',
    products: [
      {
        id: 2,
        name: 'Product 2',
        price: 200,
        weight: 289,
        quantity: 2,
      },
    ],
  },
  {
    id: 3,
    date: '2025-01-03',
    total: 750,
    status: 'pending',
    products: [
      {
        id: 3,
        name: 'Product 3',
        price: 300,
        weight: 389,
        quantity: 3,
      },
    ],
  },
  {
    id: 4,
    date: '2025-01-04',
    total: 1200,
    status: 'completed',
    products: [
      {
        id: 4,
        name: 'Product 4',
        price: 400,
        weight: 489,
        quantity: 4,
      },
    ],
  },
  {
    id: 5,
    date: '2025-01-05',
    total: 890,
    status: 'pending',
    products: [
      {
        id: 5,
        name: 'Product 5',
        price: 500,
        weight: 589,
        quantity: 5,
      },
    ],
  },
  {
    id: 6,
    date: '2025-01-06',
    total: 650,
    status: 'completed',
    products: [
      {
        id: 6,
        name: 'Product 6',
        price: 600,
        weight: 689,
        quantity: 6,
      },
    ],
  },
  {
    id: 7,
    date: '2025-01-07',
    total: 1100,
    status: 'pending',
    products: [
      {
        id: 7,
        name: 'Product 7',
        price: 700,
        weight: 789,
        quantity: 7,
      },
    ],
  },
  {
    id: 8,
    date: '2025-01-08',
    total: 950,
    status: 'completed',
    products: [
      {
        id: 8,
        name: 'Product 8',
        price: 800,
        weight: 889,
        quantity: 8,
      },
    ],
  },
  {
    id: 1,
    date: '2025-01-01',
    total: 1000,
    status: 'pending',
    products: [
      {
        id: 1,
        name: 'Product 1',
        price: 100,
        weight: 159,
        quantity: 1,
      },
      {
        id: 2,
        name: 'Product 2',
        price: 200,
        weight: 289,
        quantity: 2,
      },
    ],    
  },
  {
    id: 2,
    date: '2025-01-02',
    total: 500,
    status: 'completed',
    products: [
      {
        id: 2,
        name: 'Product 2',
        price: 200,
        weight: 289,
        quantity: 2,
      },
    ],
  },
  {
    id: 3,
    date: '2025-01-03',
    total: 750,
    status: 'pending',
    products: [
      {
        id: 3,
        name: 'Product 3',
        price: 300,
        weight: 389,
        quantity: 3,
      },
    ],
  },
  {
    id: 4,
    date: '2025-01-04',
    total: 1200,
    status: 'completed',
    products: [
      {
        id: 4,
        name: 'Product 4',
        price: 400,
        weight: 489,
        quantity: 4,
      },
    ],
  },
  {
    id: 5,
    date: '2025-01-05',
    total: 890,
    status: 'pending',
    products: [
      {
        id: 5,
        name: 'Product 5',
        price: 500,
        weight: 589,
        quantity: 5,
      },
    ],
  },
  {
    id: 6,
    date: '2025-01-06',
    total: 650,
    status: 'completed',
    products: [
      {
        id: 6,
        name: 'Product 6',
        price: 600,
        weight: 689,
        quantity: 6,
      },
    ],
  },
  {
    id: 7,
    date: '2025-01-07',
    total: 1100,
    status: 'pending',
    products: [
      {
        id: 7,
        name: 'Product 7',
        price: 700,
        weight: 789,
        quantity: 7,
      },
    ],
  },
  {
    id: 8,
    date: '2025-01-08',
    total: 950,
    status: 'completed',
    products: [
      {
        id: 8,
        name: 'Product 8',
        price: 800,
        weight: 889,
        quantity: 8,
      },
    ],
  },
]