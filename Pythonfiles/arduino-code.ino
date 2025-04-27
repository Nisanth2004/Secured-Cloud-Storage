#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <EEPROM.h>
#include <SoftwareSerial.h>

// OLED Configuration
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1  
#define OLED_ADDR     0x3C  

// EEPROM Configuration
#define EEPROM_I2C_ADDR 0x50 
#define EEPROM_SIZE 512  
#define USER_ENTRY_SIZE 50  // Define a fixed size for each user entry (including username and password)

// UART Communication with Raspberry Pi
#define RX_PIN 13  
#define TX_PIN 15 
SoftwareSerial piSerial(RX_PIN, TX_PIN);  

// OLED Display Initialization
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Flag to ensure data is read only once
bool dataRead = false;

// Keep track of next available address in EEPROM
int currentAddr = 0;

void setup() {
    Serial.begin(115200);
    delay(500);  // Allow Serial to stabilize
    Serial.println("Booting...");

    piSerial.begin(115200);  // Use a lower baud rate for SoftwareSerial
    Wire.begin();
    
    if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
        Serial.println("⚠ OLED initialization failed!");
        while (true);
    }

    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.setCursor(0, 10);
    display.println("ESP8266 Ready...");
    display.display();
    Serial.println("ESP8266 Ready - Waiting for UART Data...");

    // Initialize EEPROM read position
    currentAddr = readCurrentAddrFromEEPROM();
}

void loop() {
    if (piSerial.available()) {
        String receivedData = piSerial.readStringUntil('\n');  
        receivedData.trim();  

        if (receivedData.length() > 0 && receivedData.indexOf(':') != -1) {
            String username = receivedData.substring(0, receivedData.indexOf(':'));
            String password = receivedData.substring(receivedData.indexOf(':') + 1);

            Serial.print("📥 Received: ");
            Serial.println(receivedData);

            displayMessage("Received:\n" + username);
            delay(3000);

            // Check if username exists before storing
            if (!usernameExists(username)) {
                storeInEEPROM(username, password);
                Serial.println("✅ User stored!");

                // Only read from EEPROM if data hasn't been read already
                if (!dataRead) {
                    // Display the stored data from EEPROM on OLED
                    String storedData = readAllUsersFromEEPROM();  // Read all users once
                    displayMessage("Stored Data:\n" + storedData);
                    dataRead = true;  // Set flag to prevent multiple readings
                }
            } else {
                Serial.println("⚠ User exists!");
                displayMessage("⚠ User Exists!");
            }
        }
    }

    delay(5000);  // Delay before checking for new data again
}

// Function to check if username exists in EEPROM
bool usernameExists(String username) {
    for (int i = 0; i < EEPROM_SIZE; i += USER_ENTRY_SIZE) {
        String storedUser = readFromEEPROM(i);
        if (storedUser.startsWith(username)) {
            return true;
        }
    }
    return false;
}

// Function to store data in EEPROM
void storeInEEPROM(String username, String password) {
    String dataToStore = username + ":" + password;
    int addr = currentAddr;  // Store at the current address
    if (addr >= EEPROM_SIZE) {
        Serial.println("⚠ EEPROM Full!");
        return;
    }

    // Store data in EEPROM
    for (unsigned int i = 0; i < dataToStore.length(); i++) {
        Wire.beginTransmission(EEPROM_I2C_ADDR);
        Wire.write((addr + i) >> 8);  // High byte
        Wire.write((addr + i) & 0xFF);  // Low byte
        Wire.write(dataToStore[i]);
        Wire.endTransmission();
        delay(5);  // EEPROM write delay
    }

    // Update currentAddr for next user
    currentAddr += USER_ENTRY_SIZE;

    // Save the current address to EEPROM for persistence
    saveCurrentAddrToEEPROM(currentAddr);
}

// Function to get the next available address in EEPROM
int readCurrentAddrFromEEPROM() {
    int addr = 0;
    Wire.beginTransmission(EEPROM_I2C_ADDR);
    Wire.write(0x00); // Address to read the current address (assume stored at the start)
    Wire.endTransmission();
    Wire.requestFrom(EEPROM_I2C_ADDR, 2);
    if (Wire.available()) {
        addr = Wire.read() << 8;  // High byte
        addr |= Wire.read();      // Low byte
    }
    return addr;
}

// Function to save current address to EEPROM
void saveCurrentAddrToEEPROM(int addr) {
    Wire.beginTransmission(EEPROM_I2C_ADDR);
    Wire.write(0x00); // Start address to store the current address
    Wire.write((addr >> 8) & 0xFF);  // High byte
    Wire.write(addr & 0xFF);         // Low byte
    Wire.endTransmission();
}

// Function to read a user's data from EEPROM
String readFromEEPROM(int addr) {
    String data = "";
    char ch;
    
    for (int i = 0; i < USER_ENTRY_SIZE; i++) {  // Read 50 bytes for each user entry
        Wire.beginTransmission(EEPROM_I2C_ADDR);
        Wire.write((addr + i) >> 8);  // High byte
        Wire.write((addr + i) & 0xFF);  // Low byte
        Wire.endTransmission();
        
        Wire.requestFrom(EEPROM_I2C_ADDR, 1);
        if (Wire.available()) {
            ch = Wire.read();
            if (ch == '\0') break;  // End of string
            data += ch;
        }
    }
    return data;
}

// Function to read all users from EEPROM
String readAllUsersFromEEPROM() {
    String allUsers = "";
    int addr = 0;
    int userCount = 1;
    
    while (addr < EEPROM_SIZE) {
        String user = readFromEEPROM(addr);
        if (user != "") {
            allUsers += "User " + String(userCount) + ": " + user + "\n";
            userCount++;
        }
        addr += USER_ENTRY_SIZE;  // Move to the next user entry
    }

    return allUsers;
}

// Function to display messages on OLED
void displayMessage(String msg) {
    display.clearDisplay();
    display.setCursor(0, 10);
    display.println(msg);
    display.display();
}