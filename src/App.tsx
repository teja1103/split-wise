import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  SplitWiseCalculator,
  type Person,
  type Transaction,
  type SummaryData,
} from "./lib/splitwise-logic";
import {
  RotateCcw,
  Users,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Plus,
  Minus,
} from "lucide-react";

function App() {
  const [numPeople, setNumPeople] = useState<number>(2);
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState<string>("");
  const [newPersonAmount, setNewPersonAmount] = useState<string>("");
  const [summary, setSummary] = useState<SummaryData>({
    totalAmount: 0,
    perPersonShare: 0,
    transactionCount: 0,
  });
  const [optimizedTransactions, setOptimizedTransactions] = useState<
    Transaction[]
  >([]);

  // Initialize people array when number of people changes
  useEffect(() => {
    const newPeople = SplitWiseCalculator.initializePeople(numPeople);
    setPeople(newPeople);
  }, [numPeople]);

  // Calculate balances and optimized transactions when people data changes
  useEffect(() => {
    const result = SplitWiseCalculator.calculateSummary(people, numPeople);
    setSummary(result.summary);
    setPeople(result.updatedPeople);
    setOptimizedTransactions(result.transactions);
  }, [people.map((p) => `${p.name}-${p.paid}`).join(","), numPeople]);

  const updatePersonPaid = (index: number, amount: number) => {
    // Ensure we only work with whole numbers
    const wholeAmount = Math.floor(Math.max(0, amount || 0));
    setPeople((prev) =>
      prev.map((person, i) =>
        i === index ? { ...person, paid: wholeAmount } : person
      )
    );
  };

  const updatePersonName = (index: number, name: string) => {
    const trimmedName = name.trim();
    setPeople((prev) =>
      prev.map((person, i) =>
        i === index
          ? {
              ...person,
              name: trimmedName || `Person ${i + 1}`,
            }
          : person
      )
    );
  };

  const addPerson = () => {
    if (newPersonName.trim()) {
      const amount = Math.floor(Math.max(0, parseInt(newPersonAmount) || 0));
      const newPerson: Person = {
        name: newPersonName.trim(),
        paid: amount,
        balance: 0,
      };

      setPeople((prev) => [...prev, newPerson]);
      setNumPeople((prev) => prev + 1);
      setNewPersonName("");
      setNewPersonAmount("");
    }
  };

  const removePerson = (index: number) => {
    if (people.length > 2) {
      setPeople((prev) => prev.filter((_, i) => i !== index));
      setNumPeople((prev) => prev - 1);
    }
  };

  const resetAll = () => {
    setPeople((prev) =>
      prev.map((person) => ({ ...person, paid: 0, balance: 0 }))
    );
    setOptimizedTransactions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center justify-center gap-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            SplitWise
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Split expenses fairly with minimum transactions (whole rupees only)
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-600" />
                <Label htmlFor="numPeople" className="text-sm font-medium">
                  Number of People
                </Label>
                <Input
                  id="numPeople"
                  type="number"
                  min="2"
                  max="20"
                  value={numPeople}
                  onChange={(e) =>
                    setNumPeople(Math.max(2, parseInt(e.target.value) || 2))
                  }
                  className="w-20"
                />
              </div>
              <Button onClick={resetAll} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset All
              </Button>
            </div>

            {/* Add Person Form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                Add Person
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label
                    htmlFor="newPersonName"
                    className="text-sm font-medium"
                  >
                    Name
                  </Label>
                  <Input
                    id="newPersonName"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    placeholder="Enter person's name"
                    className="mt-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newPersonName.trim()) {
                        addPerson();
                      }
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="newPersonAmount"
                    className="text-sm font-medium"
                  >
                    Amount Paid (₹)
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      ₹
                    </span>
                    <Input
                      id="newPersonAmount"
                      type="number"
                      min="0"
                      step="1"
                      value={newPersonAmount}
                      onChange={(e) => setNewPersonAmount(e.target.value)}
                      className="pl-8"
                      placeholder="0"
                      onKeyDown={(e) => {
                        if (e.key === "." || e.key === ",") {
                          e.preventDefault();
                        }
                        if (e.key === "Enter" && newPersonName.trim()) {
                          addPerson();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={addPerson}
                    disabled={!newPersonName.trim()}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* People Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {people.map((person, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-2">
                    <Label
                      htmlFor={`name-${index}`}
                      className="text-xs text-slate-500 uppercase tracking-wide mb-1"
                    >
                      Name
                    </Label>
                    <Input
                      id={`name-${index}`}
                      value={person.name}
                      onChange={(e) => updatePersonName(index, e.target.value)}
                      className="text-center font-semibold"
                      placeholder={`Person ${index + 1}`}
                    />
                  </div>
                  {people.length > 2 && (
                    <Button
                      onClick={() => removePerson(index)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label
                    htmlFor={`paid-${index}`}
                    className="text-sm text-slate-600 dark:text-slate-400"
                  >
                    Amount Paid (₹)
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      ₹
                    </span>
                    <Input
                      id={`paid-${index}`}
                      type="number"
                      min="0"
                      step="1"
                      value={person.paid || ""}
                      onChange={(e) =>
                        updatePersonPaid(index, parseInt(e.target.value) || 0)
                      }
                      className="pl-8"
                      placeholder="0"
                      onKeyDown={(e) => {
                        // Prevent decimal point entry
                        if (e.key === "." || e.key === ",") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    {person.balance > 0
                      ? "Gets back"
                      : person.balance < 0
                      ? "Owes"
                      : "Even"}
                  </div>
                  <Badge
                    variant={
                      person.balance > 0
                        ? "default"
                        : person.balance < 0
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-sm px-3 py-1"
                  >
                    ₹{Math.abs(person.balance)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  ₹{summary.totalAmount}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total Amount
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  ₹{Math.floor(summary.totalAmount / numPeople)}
                  {summary.totalAmount % numPeople > 0 && (
                    <span className="text-sm text-slate-500">
                      {" "}
                      - ₹{Math.floor(summary.totalAmount / numPeople) + 1}
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Per Person Share
                  {summary.totalAmount % numPeople > 0 && (
                    <div className="text-xs text-slate-500 mt-1">
                      ({summary.totalAmount % numPeople} person(s) pay ₹1 extra)
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {summary.transactionCount}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Minimum Transactions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settlement Plan */}
        {optimizedTransactions.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-green-600" />
                  Optimized Settlement Plan
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300"
                >
                  Only {optimizedTransactions.length} transaction
                  {optimizedTransactions.length !== 1 ? "s" : ""} needed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizedTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Badge
                      variant="outline"
                      className="shrink-0 w-12 justify-center"
                    >
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {transaction.from}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {transaction.to}
                    </span>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 shrink-0 text-white font-semibold"
                  >
                    ₹{transaction.amount}
                  </Badge>
                </div>
              ))}

              <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  This optimized settlement plan uses the minimum number of
                  transactions ({optimizedTransactions.length}) to completely
                  settle all debts. After these transactions, everyone will be
                  even. All amounts are in whole rupees.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Show settlement status when all balances are zero */}
        {summary.totalAmount > 0 && optimizedTransactions.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <div className="mb-4">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Everyone is Even!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                All expenses have been perfectly split. No transactions needed.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {summary.totalAmount === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mb-4">
                <DollarSign className="h-12 w-12 mx-auto text-slate-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Ready to Split!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Enter the amount each person paid to calculate the optimal
                settlement plan.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;
