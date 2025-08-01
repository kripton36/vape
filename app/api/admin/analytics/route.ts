import { NextRequest, NextResponse } from 'next/server'
import { orderQueries, userQueries, productQueries } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get analytics data
    const [
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders,
      topProducts,
      userGrowth,
      revenueByDay
    ] = await Promise.all([
      orderQueries.getTotalRevenue(startDate),
      orderQueries.getTotalOrders(startDate),
      userQueries.getTotalUsers(startDate),
      productQueries.getTotalProducts(),
      orderQueries.getRecentOrders(10),
      productQueries.getTopSellingProducts(5),
      userQueries.getUserGrowth(startDate),
      orderQueries.getRevenueByDay(startDate)
    ])

    // Calculate growth percentages
    const previousPeriodStart = new Date(startDate)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - parseInt(period))

    const [
      previousRevenue,
      previousOrders,
      previousUsers
    ] = await Promise.all([
      orderQueries.getTotalRevenue(previousPeriodStart, startDate),
      orderQueries.getTotalOrders(previousPeriodStart, startDate),
      userQueries.getTotalUsers(previousPeriodStart, startDate)
    ])

    const revenueGrowth = previousRevenue > 0 ? 
      ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0
    const ordersGrowth = previousOrders > 0 ? 
      ((totalOrders - previousOrders) / previousOrders) * 100 : 0
    const usersGrowth = previousUsers > 0 ? 
      ((totalUsers - previousUsers) / previousUsers) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          totalOrders,
          totalUsers,
          totalProducts,
          revenueGrowth: Math.round(revenueGrowth * 100) / 100,
          ordersGrowth: Math.round(ordersGrowth * 100) / 100,
          usersGrowth: Math.round(usersGrowth * 100) / 100
        },
        charts: {
          revenueByDay,
          userGrowth
        },
        lists: {
          recentOrders,
          topProducts
        }
      }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}