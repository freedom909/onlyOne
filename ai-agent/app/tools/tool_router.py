from app.tools.booking_tool import get_booking, cancel_booking, create_booking

async def execute_tool(name: str, args: dict):
    if name == "getBooking":
        return await get_booking(args["bookingId"])

    if name == "cancelBooking":
        return await cancel_booking(args["bookingId"])

    if name == "createBooking":
        return await create_booking(
            listing_id=args["listingId"],
            patient_id=args.get("patientId", ""),
            check_in_date=args["checkInDate"],
            check_out_date=args["checkOutDate"],
            patient_count=args.get("patientCount", 1),
        )

    return {"error": "Unknown tool"}