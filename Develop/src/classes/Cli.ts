// importing classes from other files
import inquirer from "inquirer";
import Truck from "./Truck.js";
import Car from "./Car.js";
import Motorbike from "./Motorbike.js";
import Wheel from "./Wheel.js";

// define the Cli class
class Cli {
  vehicles: (Car | Motorbike | Truck)[];
  selectedVehicleVin: string | undefined;
  exit: boolean = false;

  constructor(vehicles: (Car | Motorbike | Truck)[]) {
    this.vehicles = vehicles;
  }

  static generateVin(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  startCli(): void {
    inquirer
      .prompt([
        {
          type: "list",
          name: "CreateOrSelect",
          message: "Would you like to create a new vehicle or select an existing one?",
          choices: ["Create a new vehicle", "Select an existing vehicle"],
        },
      ])
      .then((answers) => {
        if (answers.CreateOrSelect === "Create a new vehicle") {
          this.createVehicle();
        } else {
          this.chooseVehicle();
        }
      });
  }

  createVehicle(): void {
    inquirer
      .prompt([
        {
          type: "list",
          name: "vehicleType",
          message: "Select a vehicle type",
          choices: ["Car", "Truck", "Motorbike"],
        },
      ])
      .then((answers) => {
        if (answers.vehicleType === "Car") {
          this.createCar();
        } else if (answers.vehicleType === "Truck") {
          this.createTruck();
        } else if (answers.vehicleType === "Motorbike") {
          this.createMotorbike();
        }
      });
  }

  chooseVehicle(): void {
    inquirer
      .prompt([
        {
          type: "list",
          name: "selectedVehicleVin",
          message: "Select a vehicle to perform an action on",
          choices: this.vehicles.map((vehicle) => {
            return {
              name: `${vehicle.vin} -- ${vehicle.make} ${vehicle.model}`,
              value: vehicle.vin,
            };
          }),
        },
      ])
      .then((answers) => {
        this.selectedVehicleVin = answers.selectedVehicleVin;
        this.performActions();
      });
  }

  createCar(): void {
    inquirer
      .prompt([
        { type: "input", name: "color", message: "Enter Color" },
        { type: "input", name: "make", message: "Enter Make" },
        { type: "input", name: "model", message: "Enter Model" },
        { type: "input", name: "year", message: "Enter Year" },
        { type: "input", name: "weight", message: "Enter Weight" },
        { type: "input", name: "topSpeed", message: "Enter Top Speed" },
      ])
      .then((answers) => {
        const car = new Car(
          Cli.generateVin(),
          answers.color,
          answers.make,
          answers.model,
          parseInt(answers.year),
          parseInt(answers.weight),
          parseInt(answers.topSpeed),
          [new Wheel(), new Wheel(), new Wheel(), new Wheel()]
        );
        this.vehicles.push(car);
        this.selectedVehicleVin = car.vin;
        this.performActions();
      });
  }

  createTruck(): void {
    inquirer
      .prompt([
        { type: "input", name: "color", message: "Enter Color" },
        { type: "input", name: "make", message: "Enter Make" },
        { type: "input", name: "model", message: "Enter Model" },
        { type: "input", name: "year", message: "Enter Year" },
        { type: "input", name: "weight", message: "Enter Weight" },
        { type: "input", name: "topSpeed", message: "Enter Top Speed" },
        { type: "input", name: "towingCapacity", message: "Enter Towing Capacity" },
      ])
      .then((answers) => {
        const truck = new Truck(
  Cli.generateVin(),
  answers.color,
  answers.make,
  answers.model,
  parseInt(answers.year),
  parseInt(answers.weight),
  parseInt(answers.topSpeed),
  parseInt(answers.towingCapacity), // ✅ Moved before wheels
  [new Wheel(), new Wheel(), new Wheel(), new Wheel()] // ✅ Wheels placed last
);
        this.vehicles.push(truck);
        this.selectedVehicleVin = truck.vin;
        this.performActions();
      });
  }

  createMotorbike(): void {
    inquirer
      .prompt([
        { type: "input", name: "color", message: "Enter Color" },
        { type: "input", name: "make", message: "Enter Make" },
        { type: "input", name: "model", message: "Enter Model" },
        { type: "input", name: "year", message: "Enter Year" },
        { type: "input", name: "weight", message: "Enter Weight" },
        { type: "input", name: "topSpeed", message: "Enter Top Speed" },
      ])
      .then((answers) => {
        const motorbike = new Motorbike(
          Cli.generateVin(),
          answers.color,
          answers.make,
          answers.model,
          parseInt(answers.year),
          parseInt(answers.weight),
          parseInt(answers.topSpeed),
          [new Wheel(), new Wheel()]
        );
        this.vehicles.push(motorbike);
        this.selectedVehicleVin = motorbike.vin;
        this.performActions();
      });
  }

  performActions(): void {
    console.log("Performing actions on vehicle...")
    inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "Select an action",
        choices: [
          "Print details",
          "Start vehicle",
          "Accelerate 5 MPH",
          "Decelerate 5 MPH",
          "Stop vehicle",
          "Turn right",
          "Turn left",
          "Reverse",
          "Perform wheelie (Motorbike only)",
          "Tow a vehicle (Truck only)",
          "Select or create another vehicle",
          "Exit"
        ],
      },
    ])
    .then((answers) => {
      const selectedVehicle = this.vehicles.find(v => v.vin === this.selectedVehicleVin);
      
      if (!selectedVehicle) {
        console.log("No vehicle selected.");
        this.startCli();
        return;
      }
      if (answers.action === "Print details") {
        selectedVehicle.printDetails();
      } else if (answers.action === "Start vehicle") {
        selectedVehicle.start();
      } else if (answers.action === "Accelerate 5 MPH") {
        selectedVehicle.accelerate(5);
      } else if (answers.action === "Decelerate 5 MPH") {
        selectedVehicle.decelerate(5);
      } else if (answers.action === "Stop vehicle") {
        selectedVehicle.stop();
      } else if (answers.action === "Turn right") {
        selectedVehicle.turn("right");
      } else if (answers.action === "Turn left") {
        selectedVehicle.turn("left");
      } else if (answers.action === "Reverse") {
        selectedVehicle.reverse();
      } else if (answers.action === "Perform wheelie (Motorbike only)" && selectedVehicle instanceof Motorbike) {
        selectedVehicle.wheelie();
      } else if (answers.action === "Tow a vehicle (Truck only)" && selectedVehicle instanceof Truck) {
        this.findVehicleToTow(selectedVehicle);
      } else if (answers.action === "Select or create another vehicle") {
        this.startCli();
        return;
      } else if (answers.action === "Exit") {
        console.log("Exiting program...");
        process.exit(0);
      }

      // Call performActions again for the next action
      this.performActions();
    });
};
findVehicleToTow(truck: Truck): void {
  console.log(`Initiating vehicle tow process for ${truck.make} ${truck.model}...`);
  
  inquirer
    .prompt([
      {
        type: "list",
        name: "vehicleToTow",
        message: "Select a vehicle to tow",
        choices: this.vehicles
          .filter(vehicle => vehicle !== truck) // Exclude the truck itself
          .map((vehicle) => ({
            name: `${vehicle.vin} -- ${vehicle.make} ${vehicle.model}`,
            value: vehicle,
          })),
      },
    ])
    .then((answers) => {
      const vehicleToTow = answers.vehicleToTow;
      
      console.log(`Selected vehicle to tow: ${vehicleToTow.make} ${vehicleToTow.model}`);

      if (vehicleToTow === truck) {
        console.log("A truck cannot tow itself! Please select another vehicle.");
        this.performActions();
      } else {
        console.log(`${truck.make} ${truck.model} is attempting to tow ${vehicleToTow.make} ${vehicleToTow.model}...`);
        truck.tow(vehicleToTow);
        console.log(`${truck.make} ${truck.model} has completed the tow operation.`);
        this.performActions();
      }
    })
    .catch((error) => {
      console.error("Error selecting a vehicle to tow:", error);
      this.performActions();
    });
}}
// export the Cli class as the default export
export default Cli;