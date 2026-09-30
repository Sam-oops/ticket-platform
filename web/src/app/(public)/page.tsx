import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import Spinner from '@/components/ui/Spinner';

export default function Home() {
  return (
    <div className="bg-background min-h-screen p-8">
      <main className="bg-surface flex flex-col gap-4 items-start p-6 rounded-card">
        <Card>
          <div className="flex flex-col gap-4">
            <Button size="lg" variant="primary">
              Кнопка 1
            </Button>
            <Button size="lg" variant="secondary">
              Кнопка 2
            </Button>
            <Button size="sm" variant="ghost">
              Кнопка 3
            </Button>
            <Button variant="danger">Кнопка 4</Button>
            <Badge tone="neutral">neutral</Badge>
            <Badge tone="success">success</Badge>
            <Badge tone="warning">warning</Badge>
            <Badge tone="danger">danger</Badge>
            <Input
              label="Событие"
              error="Заполните"
              placeholder="THIS IS INPUT"
            />
            <Input label="Событие" placeholder="THIS IS INPUT" />
          </div>
        </Card>
        <Skeleton className="h-40 w-full h-4 w-48" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </main>
    </div>
  );
}
