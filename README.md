# SplitWise 💰

A React-based expense splitting application that calculates the optimal settlement plan with minimum transactions. Built with TypeScript and modern UI components.

## Why I Built This

I developed this application because I was bored and just wanted to do some math! 🤓 There's something satisfying about solving the classic "minimum transactions" problem that comes up when splitting expenses among friends. Plus, I wanted to practice React with TypeScript and create something actually useful.

## What It Does

SplitWise takes a group of people and their individual expenses, then calculates:

1. **Fair Split**: How much each person should pay (rounded to whole rupees)
2. **Individual Balances**: Who owes money and who gets money back
3. **Optimized Settlements**: The minimum number of transactions needed to settle all debts

## The Math Behind It

### 1. Fair Splitting Logic
- Calculates total expenses across all participants
- Divides by number of people (rounded down to avoid fractional cents)
- Distributes any remainder rupees to the first few people
- Example: ₹100 split among 3 people = ₹33 each, with 1 person paying ₹34

### 2. Balance Calculation
For each person: `Balance = Amount Paid - Fair Share`
- Positive balance = Gets money back
- Negative balance = Owes money
- Zero balance = Even

### 3. Minimum Transactions Algorithm
The app uses a greedy algorithm to minimize transactions:

1. Find the person with the largest debt (most negative balance)
2. Find the person with the largest credit (most positive balance)
3. Create a transaction between them for the smaller of the two amounts
4. Update balances and remove settled participants
5. Repeat until all balances are zero

This approach guarantees the minimum number of transactions needed to settle all debts.

## Features

- ✅ **Dynamic Participant Management**: Add/remove people on the fly
- ✅ **Real-time Calculations**: Instant updates as you enter expenses
- ✅ **Whole Rupee Support**: No decimal calculations to avoid rounding errors
- ✅ **Optimized Settlements**: Minimum transaction algorithm
- ✅ **Visual Balance Display**: Clear indication of who owes what
- ✅ **Dark Mode Support**: Easy on the eyes
- ✅ **Responsive Design**: Works on mobile and desktop

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for beautiful UI components
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd split-wise
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Example

Let's say 4 friends go out for dinner:

- **Alice** pays ₹500 for the bill
- **Bob** pays ₹200 for drinks  
- **Charlie** pays ₹100 for appetizers
- **Diana** pays ₹0

**Total**: ₹800  
**Per person**: ₹200 each

**Balances**:
- Alice: ₹500 - ₹200 = +₹300 (gets back)
- Bob: ₹200 - ₹200 = ₹0 (even)
- Charlie: ₹100 - ₹200 = -₹100 (owes)
- Diana: ₹0 - ₹200 = -₹200 (owes)

**Optimized Settlement** (only 2 transactions needed):
1. Diana pays Alice ₹200
2. Charlie pays Alice ₹100

Everyone is now even with just 2 transactions instead of multiple back-and-forth payments!

## Project Structure

```
src/
├── App.tsx                 # Main application component
├── lib/
│   └── splitwise-logic.ts  # Core mathematical logic
├── components/ui/          # Reusable UI components
└── ...
```

## Development Notes

The core logic is contained in `src/lib/splitwise-logic.ts` with the `SplitWiseCalculator` class that handles:
- People initialization
- Balance calculations  
- Transaction optimization
- Data validation

The UI is built with modern React patterns using hooks and TypeScript for type safety.

## Contributing

Feel free to open issues or submit pull requests if you find bugs or want to add features!


*Built with ❤️ and a bit of mathematical curiosity!*
