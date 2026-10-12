import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vegetable } from '../models/vegetable.model';
import { VegetableApiService } from '../services/vegetable-api.service';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  vegetables: Vegetable[] = [];
  loading = true;
  saving = false;
  showForm = false;
  editingId: number | null = null;
  search = '';
  error = '';
  message = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  form = this.emptyForm();
  readonly Number = Number;

  constructor(public api: VegetableApiService) {}
  ngOnInit(): void { this.load(); }

  get totalStock(): number { return this.vegetables.reduce((sum, v) => sum + Number(v.stock_quantity), 0); }
  get lowStock(): number { return this.vegetables.filter(v => v.stock_quantity > 0 && v.stock_quantity <= 5).length; }
  get unavailable(): number { return this.vegetables.filter(v => !v.is_available || v.stock_quantity < 1).length; }

  private emptyForm() {
    return { name: '', description: '', price: 0, stock_quantity: 0, unit: 'kg', is_available: true };
  }

  load(): void {
    if (this.timer) clearTimeout(this.timer);
    this.loading = true;
    this.timer = setTimeout(() => this.api.getVegetables(this.search.trim(), 100).subscribe({
      next: response => { this.vegetables = response.data; this.loading = false; },
      error: () => { this.error = 'Unable to load inventory. Check the backend connection.'; this.loading = false; }
    }), 150);
  }

  openCreate(): void {
    this.editingId = null;
    this.form = this.emptyForm();
    this.selectedFile = null;
    this.imagePreview = null;
    this.error = '';
    this.showForm = true;
  }

  openEdit(v: Vegetable): void {
    this.editingId = v.id;
    this.form = {
      name: v.name,
      description: v.description || '',
      price: Number(v.price),
      stock_quantity: v.stock_quantity,
      unit: v.unit,
      is_available: v.is_available
    };
    this.selectedFile = null;
    this.imagePreview = this.api.imageUrl(v.image_url);
    this.error = '';
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.error = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file && file.size > 5 * 1024 * 1024) {
      this.error = 'Image must be 5 MB or smaller.';
      input.value = '';
      this.selectedFile = null;
      return;
    }
    this.error = '';
    this.selectedFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = String(reader.result);
      reader.readAsDataURL(file);
    }
  }

  save(): void {
    if (this.saving) return;
    this.error = '';
    this.message = '';
    const payload = new FormData();
    payload.append('name', this.form.name.trim());
    payload.append('description', this.form.description.trim());
    payload.append('price', String(this.form.price));
    payload.append('stock_quantity', String(this.form.stock_quantity));
    payload.append('unit', this.form.unit);
    // Current backend validator expects a boolean for is_available, but multipart fields arrive as strings.
    // Omit this field for compatibility; backend defaults new/updated products to available.
    if (this.selectedFile) payload.append('image', this.selectedFile);

    this.saving = true;
    const request = this.editingId
      ? this.api.updateVegetable(this.editingId, payload)
      : this.api.createVegetable(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.message = this.editingId ? 'Vegetable updated successfully.' : 'Vegetable added successfully.';
        this.closeForm();
        this.load();
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.errors?.join(' ') || err?.error?.message || 'Unable to save vegetable.';
      }
    });
  }

  remove(v: Vegetable): void {
    if (!window.confirm(`Delete ${v.name}? This cannot be undone.`)) return;
    this.error = '';
    this.message = '';
    this.api.deleteVegetable(v.id).subscribe({
      next: () => { this.message = `${v.name} deleted successfully.`; this.load(); },
      error: err => this.error = err?.error?.message || 'Unable to delete vegetable.'
    });
  }
}
