import { prisma } from '@/util/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import formatPrice from '@/util/PriceFormat'
import Image from 'next/image'

//refetch the data to reflect latest order's status - NextJS
export const revalidate = 0

const fetchOrders = async () => {
  const user = await getServerSession(authOptions)

  if (!user) {
    return null
  }

  // find all orders of the user
  const orders = await prisma.order.findMany({
    where: { 
      userId: user?.user?.id,
      status: 'complete' 
    }, 
    include: { products: true },
  })
  return orders
}

export default async function DashBoard() {

  const orders = await fetchOrders()

  if (orders === null) 
    return <div>You need to be looged in to view your order</div>

  if (orders.length === 0) {
    return (
      <div>
        <h1>No orders placed</h1>
      </div>
    )
  }
  return (
    <div className='font-medium'>
      {orders.map((order) => (
        <div key={order.id} className='rounded-lg p-8 my-4 space-y-2 bg-base-200'>
          <h2 className='text-xs font-medium'>Order reference: {order.id}</h2>
          <p className='text-xs'>Time: {new Date(order.createdDate).toString()}</p>
          <p className='text-md py-2 text-xs'>
            Status: {' '}
            <span 
              className={'bg-teal-500 text-white py-1 rounded-md px-2 mx-2 text-sm'}>
              {order.status}
            </span>
          </p>
          <p className='font-medium'>Total: {formatPrice(order.amount)}</p>
          <div className='text-sm lg:flex items-center lg:items-baseline gap-4'>
            {order.products.map((product) => (
              <div className='py-2' key={product.id}>
                <h2 className='py-2'>{product.name}</h2>
                <div className='flex items-baseline gap-4'>
                  <Image
                    src={product.image!}
                    width={36}
                    height={36}
                    alt={product.name}
                    priority={true}
                    className='w-auto'
                  />
                  <p>{formatPrice(product.unit_amount)}</p>
                  <p>Quantity: {product.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ) 
}
