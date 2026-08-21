// src/core/listing/application/usecase/searchListingUseCase.ts
import { inject, injectable } from "tsyringe";
import { TOKENS_LISTING } from "@/modules/tokens/listing.tokens";
import { IListingRepository, SearchListingsQuery } from "../../domain/entities/IListingRepository";

@injectable()
export class SearchListingUseCase {

  constructor(
    @inject(TOKENS_LISTING.repos.listingRepository)
    private readonly repo: IListingRepository
  ) {}

  async execute({location,checkIn,checkOut,patientCount,minPrice,maxPrice}: SearchListingsQuery) {
    
    const listings = await this.repo.search({location,checkIn,checkOut,patientCount,minPrice,maxPrice});
    
    return {
      listings: listings.map(l => ({
        id: l.id,
        title: l.title,
        description: l.description,
        address: l.address,
        price: l.price,
        numOfBeds: l.numOfBeds,
        numOfPatients: l.numOfPatients,
        numOfBathrooms: l.numOfBathrooms,
        numOfRooms: l.numOfRooms,
        picture: l.pictures,// is anything wrong here?
        isFeatured: l.isFeatured,
      })),
      total: listings.length,
    };
  }
}
