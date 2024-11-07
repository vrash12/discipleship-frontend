// Base Bicycle class
// Van Rodolf Suliva - NA-3A
class Bicycle {
    // Attributes
    String type;
    String brand;
    String model;
    int gearCount;
    String color;

    // Constructor to initialize Bicycle object
    public Bicycle(String type, String brand, String model, int gearCount, String color) {
        this.type = type;
        this.brand = brand;
        this.model = model;
        this.gearCount = gearCount;
        this.color = color;
    }

    // Methods
    public void pedal() {
        System.out.println("Pedaling the " + type + " bike.");
    }

    public void brake() {
        System.out.println("Braking the " + type + " bike.");
    }

    public void changeGear(int newGear) {
        System.out.println("Changing gear to " + newGear + " on the " + type + " bike.");
    }

    // Method to display bike information
    public void displayInfo() {
        System.out.println();
        System.out.println("Type: " + type);
        System.out.println("Brand: " + brand);
        System.out.println("Model: " + model);
        System.out.println("Gear Count: " + gearCount);
        System.out.println("Color: " + color);
    }
}

// Main class to test Bicycle objects
public class Main {
    public static void main(String[] args) {
        // Creating objects for each type of bicycle
        Bicycle mountainBike = new Bicycle("Mountain Bike", "Trek", "X-Caliber 9", 18, "Red");
        Bicycle electricBike = new Bicycle("Electric Bike", "Rad Power", "RadRover 6 Plus", 21, "Black");
        Bicycle roadBike = new Bicycle("Road Bike", "Specialized", "Allez Elite", 12, "Grey");

        // Displaying information and using methods for each bike
        mountainBike.displayInfo();
        mountainBike.pedal();
        mountainBike.changeGear(5);
        mountainBike.brake();

 

        electricBike.displayInfo();
        electricBike.pedal();
        electricBike.changeGear(3);
        electricBike.brake();



        roadBike.displayInfo();
        roadBike.pedal();
        roadBike.changeGear(7);
        roadBike.brake();
    }
}
