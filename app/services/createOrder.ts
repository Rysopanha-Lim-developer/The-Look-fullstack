import { dbConnection } from "../lib/dbConnection";
import { Order, OrderItem, OrderModel } from "../models/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function createOrder(request:NextRequest) {
    await dbConnection();
    
}
