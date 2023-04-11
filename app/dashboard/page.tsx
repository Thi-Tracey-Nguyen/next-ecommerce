import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import formatPrice from '@/util/PriceFormat'

const fetchOrders = async () => {
  const prisma = new PrismaClient()
  const user = await getServerSession(authOptions)

  if (!user) {
    return null
  }

  // find all orders of the user
  const orders = await prisma.order.findMany({
    where: { userId: user?.user?.id }, 
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
        <div key={order.id} className='rounded-lg'>
          <h2>Order reference: {order.id}</h2>
          <p>Time: {new Date(order.createdDate)}</p>
          <p className='text-md py-2'>
            Status: {' '}
            <span 
              className={`${
                order.status === 'complete' ? 'bg-teal-500' : 'bg-orange-500'
            } text-white py-1 rounded-md px-2 mx-2 text-sm`}>
              {order.status}
            </span>
          </p>
          <p className='font-medium'>Total: {formatPrice(order.amount)}</p>
        </div>
      ))}
    </div>
  ) 
}
