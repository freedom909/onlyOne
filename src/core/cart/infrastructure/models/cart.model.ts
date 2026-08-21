import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "@/infrastructure/config/seq";

export interface CartAttributes {
  id: string;
  patientId: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  price: number;
}

type CartCreationAttributes = Optional<CartAttributes, "id" | "checkInDate" | "checkOutDate">;

export class CartModel extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public id!: string;
  public patientId!: string;
  public checkInDate?: Date;
  public checkOutDate?: Date;
  public price!: number;
}

CartModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checkInDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    checkOutDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "carts",
    timestamps: true,
  }
);
