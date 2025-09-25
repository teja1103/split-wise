export interface Person {
  name: string
  paid: number
  balance: number
}

export interface Transaction {
  from: string
  to: string
  amount: number
}

export interface SummaryData {
  totalAmount: number
  perPersonShare: number
  transactionCount: number
}

export class SplitWiseCalculator {
  static initializePeople(numPeople: number): Person[] {
    return Array.from({ length: numPeople }, (_, index) => ({
      name: `Person ${index + 1}`,
      paid: 0,
      balance: 0
    }))
  }

  static calculateOptimizedSettlements(peopleList: Person[]): Transaction[] {
    // Create copies to avoid mutating original data
    const balances = peopleList.map(p => ({ 
      name: p.name, 
      balance: p.balance 
    })).filter(p => p.balance !== 0) // Only include people with non-zero balances
    
    const transactions: Transaction[] = []
    
    // Continue until all balances are settled
    while (balances.length > 1) {
      // Find the person with the most debt (most negative balance)
      let maxDebtorIndex = 0
      for (let i = 1; i < balances.length; i++) {
        if (balances[i].balance < balances[maxDebtorIndex].balance) {
          maxDebtorIndex = i
        }
      }
      
      // Find the person with the most credit (most positive balance)
      let maxCreditorIndex = 0
      for (let i = 1; i < balances.length; i++) {
        if (balances[i].balance > balances[maxCreditorIndex].balance) {
          maxCreditorIndex = i
        }
      }
      
      const debtor = balances[maxDebtorIndex]
      const creditor = balances[maxCreditorIndex]
      
      // If we only have creditors or only debtors left, something went wrong
      if (debtor.balance >= 0 || creditor.balance <= 0) {
        break
      }
      
      // Calculate transaction amount (minimum of debt and credit)
      const debtAmount = Math.abs(debtor.balance)
      const creditAmount = creditor.balance
      const transactionAmount = Math.min(debtAmount, creditAmount)
      
      if (transactionAmount > 0) {
        transactions.push({
          from: debtor.name,
          to: creditor.name,
          amount: transactionAmount
        })
        
        // Update balances
        debtor.balance += transactionAmount
        creditor.balance -= transactionAmount
      }
      
      // Remove settled people from the array
      const toRemove = []
      if (debtor.balance === 0) {
        toRemove.push(maxDebtorIndex)
      }
      if (creditor.balance === 0 && maxCreditorIndex !== maxDebtorIndex) {
        toRemove.push(maxCreditorIndex)
      }
      
      // Remove in reverse order to maintain indices
      toRemove.sort((a, b) => b - a).forEach(index => {
        balances.splice(index, 1)
      })
    }
    
    return transactions
  }

  static calculateSummary(people: Person[], numPeople: number): { 
    summary: SummaryData, 
    updatedPeople: Person[], 
    transactions: Transaction[] 
  } {
    // Calculate total with proper rounding to whole rupees
    const total = people.reduce((sum, person) => sum + Math.floor(person.paid || 0), 0)
    
    if (numPeople === 0 || total === 0) {
      return {
        summary: { totalAmount: total, perPersonShare: 0, transactionCount: 0 },
        updatedPeople: people.map(p => ({ ...p, balance: 0 })),
        transactions: []
      }
    }

    // Calculate per person share (rounded down to avoid fractional cents)
    const share = Math.floor(total / numPeople)
    
    // Calculate remainder that will be distributed
    const remainder = total - (share * numPeople)
    
    const updatedPeople = people.map((person, index) => {
      // First few people get an extra rupee if there's a remainder
      const extraRupee = index < remainder ? 1 : 0
      const adjustedShare = share + extraRupee
      
      return {
        ...person,
        balance: Math.floor(person.paid || 0) - adjustedShare
      }
    })
    
    const transactions = this.calculateOptimizedSettlements(updatedPeople)
    
    return {
      summary: {
        totalAmount: total,
        perPersonShare: share + (remainder > 0 ? 1 : 0), // Show max share for display
        transactionCount: transactions.length
      },
      updatedPeople,
      transactions
    }
  }

  static validatePersonData(people: Person[]): boolean {
    return people.every(person => 
      person.name.trim() !== '' && 
      typeof person.paid === 'number' && 
      person.paid >= 0
    )
  }
}
