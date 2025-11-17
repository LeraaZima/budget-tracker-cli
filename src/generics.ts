// 1) Интерфейс Identifiable 
export interface Identifiable {
  id: number;
}

// 2) Интерфейс Describable 
export interface Describable {
  describe(): string;
}


//2
export class GenericStorage<T extends Identifiable> {
  // приватный массив — внешние части программы НЕ могут изменить его напрямую
  private items: T[] = [];

  // Метод add — добавляет элемент
  add(item: T): void {
    this.items.push(item);
  }

  // Метод removeById — удаляет элемент если id совпадает
  removeById(id: number): boolean {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return false; // элемент не найден
    }

    this.items.splice(index, 1);
    return true;
  }

  // Метод getById — возвращает один элемент или undefined
  getById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  //
  getAll(): T[] {
    return [...this.items];
  }

//3

  describeAll(): void {
    for (const item of this.items) {
      // Проверяем: реализует ли объект метод describe()?
      // TypeScript проверяет тип на этапе компиляции,
      // но здесь используется JS-проверка: наличие функции в объекте.
      if (typeof (item as any).describe === 'function') {
        console.log((item as unknown as Describable).describe());
      } else {
        console.log(`Элемент id: ${item.id} не содержит описания.`);
      }
    }
  }
}


//4

// Product должен реализовать оба интерфейса: Identifiable и Describable
export class Product implements Identifiable, Describable {
  constructor(public id: number, public name: string, public price: number) {}

  describe(): string {
    return `Product #${this.id}: ${this.name}, price: $${this.price}`;
  }
}

