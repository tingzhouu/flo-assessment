# NEM12 Converter CLI

A command-line tool to convert NEM12 format meter reading files to SQL format. Built with TypeScript and featuring error handling, and user-friendly output.

## 🚀 Quick Start

```bash
# Build the CLI
npm run build:cli

# Convert a NEM12 file to SQL (uses input filename)
node dist/cli.js convert input.csv

# Convert with custom output name
node dist/cli.js convert input.csv output

# Or install globally for easier access
npm run install-cli
nem12-converter convert input.csv
```

## 📦 Installation

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd nem12-converter

# Ensure you have node (v22.15.0) installed, otherwise see here for installation https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating
node --version

# Install dependencies
npm install

# Build the CLI
npm run build:cli
```

### Global Installation

```bash
# Install CLI globally on your system
npm run install-cli

# Now you can use 'nem12-converter' from anywhere
nem12-converter --help
```

## 🔧 Commands

### `convert` - Convert NEM12 to SQL

Convert a NEM12 file to SQL format with error reporting.

```bash
nem12-converter convert <input> [output] [options]
```

**Arguments:**

- `<input>` - Path to the input NEM12 file
- `[output]` - Optional output file path (without extension, `.sql` will be added). If not specified, uses the input filename

**Options:**

- `-v, --verbose` - Enable detailed output with progress and timing

**Examples:**

```bash
# Basic conversion (uses input filename)
nem12-converter convert meter-data.csv

# Conversion with custom output name
nem12-converter convert meter-data.csv output

# Verbose output with progress
nem12-converter convert meter-data.csv output --verbose
```

### `info` - Display File Information

Display detailed information about a NEM12 file including size, format, and metadata.

```bash
nem12-converter info <input>
```

**Example:**

```bash
nem12-converter info meter-data.csv
```

**Sample Output:**

```
📊 File Information: meter-data.csv
──────────────────────────────────────────────────
File Size: 15.2 KB
Modified:  2024-01-15T10:30:00.000Z
Format:    NEM12
Version:   202401010000
Lines:     156
```

## 📊 Output Files

### SQL Output (`output.sql`)

Contains the converted meter readings in SQL INSERT format:

```sql
-- Generated NEM12 meter readings
-- Source: meter-data.csv
-- Generated: 2024-01-15T10:30:00.000Z

INSERT INTO meter_readings (nmi, timestamp, consumption)
VALUES
('1234567890', '2024-01-01 00:30:00', 1.25),
('1234567890', '2024-01-01 01:00:00', 1.30),
-- ... more readings

-- Total readings: 1440
-- NMI count: 2
-- Date range: 2024-01-01 00:30:00 to 2024-01-02 00:00:00
```

### Error Output (`output.errors`) - If Issues Found

Contains parsing errors and warnings:

```
3: (INVALID_CONSUMPTION_FORMAT) Invalid consumption value at interval 1: 'abc' is not a valid decimal
5: (MISSING_NMI) NMI field is required
```

## 🎨 Features

### ✅ **Error Handling**

- File format verification
- Data type checking
- Detailed error reporting with line numbers
- Invalid data is skipped, fatal errors will lead to early termination

### 🚀 **Performance**

- Streaming file processing
- Progress reporting for large files
- Efficient memory usage

### 🎯 **User Experience**

- Colored output with emojis
- Clear error messages
- Verbose mode for debugging

### 🛡️ **Input Validation**

- Input file validation
- Output directory checks
- Graceful error recovery
- Detailed error logging

## 📝 Examples

### Basic Usage

```bash
# Convert a NEM12 file (uses filename data.sql)
nem12-converter convert data.csv

# Convert with custom output name
nem12-converter convert data.csv my-output

# Files created:
# - my-output.sql (SQL statements)
# - my-output.errors (errors, if any)
```

### Advanced Usage

```bash
# Verbose conversion with progress
nem12-converter convert large-file.csv output --verbose

# Output:
# 📝 Starting conversion...
#    Input:  large-file.csv
#    Output: output.sql
# ⚡ Converting file...
# Processed 1000 readings...
# Processed 2000 readings...
# ⏱️  Conversion completed in 245ms
# ✅ Conversion completed successfully
#    SQL output: output.sql
```

### Working with Files That Have Errors

```bash
# Step 1: Get file information
nem12-converter info unknown-file.csv

# Step 2: Attempt conversion
nem12-converter convert unknown-file.csv final-output --verbose

# If there are errors, check the .errors file:
# cat final-output.errors
```

## 🔧 Development

### Available Scripts

```bash
npm run build          # Build TypeScript
npm run build:cli      # Build CLI with executable permissions
npm run test           # Run test suite
npm run cli            # Build and run CLI
npm run install-cli    # Install CLI globally
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm test -- src/converter/__tests__/nem12-converter.spec.ts
```

## 🐛 Troubleshooting

### Common Issues

**Permission Denied**

```bash
# Make sure CLI is executable
chmod +x dist/cli.js
```

**Module Not Found**

```bash
# Rebuild the project
npm run build:cli
```

**File Processing Issues**

```bash
# Check file info first
nem12-converter info your-file.csv

# Run with verbose output for more details
nem12-converter convert your-file.csv output --verbose
```
