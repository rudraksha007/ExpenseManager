import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FundEntry } from "@/lib/utils";
import { PieChart, Cell, Legend, Pie, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Chart({ data, title, label }: { data: FundEntry[] | undefined, title: string; label?: boolean }) {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                {data?.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            {label && <Legend />}
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        No data available
                    </div>
                )}
            </CardContent>
        </Card>
    )
};