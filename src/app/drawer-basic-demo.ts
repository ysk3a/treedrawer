import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSwitcher } from './themeswitcher';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'primeng/api';

interface NavNode {
  id: string;
  label: string;
  children?: NavNode[]; // The "N" amount of siblings/options
  data?: any;
  visible?: boolean; // Required for animation control
}

@Component({
  selector: 'drawer-basic-demo',
  templateUrl: 'drawer-basic-demo.html',
  standalone: true,
  imports: [CommonModule, ThemeSwitcher, ButtonModule, DrawerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerBasicDemo implements OnInit {
  //   // Automatically derive the breadcrumb items whenever the stack changes
  //   breadcrumbItems = computed<MenuItem[]>(() => {
  //     return this.activePath().map((node, index) => ({
  //       label: node.label,
  //       // When a crumb is clicked, jump back to that specific level
  //       command: () => this.jumpTo(index),
  //     }));
  //   });

  // 2. Initialize the signal as an empty array or with the root
  activePath = signal<readonly NavNode[]>([]);
  private http = inject(HttpClient);
  isLoading = signal(false);

  ngOnInit() {
    // If you want the first drawer open immediately on page load:
  }

  // 1. To Open: Just push a new node with visible: true
  // 1. Open: Add to array with visible = true
  openNext(nodeData: any) {
    this.activePath.update((path) => [...path, { ...nodeData, visible: true }]);
  }

  // 2. Close: This only runs AFTER the animation finishes
  finalizeClose2(index: number) {
    this.activePath.update((path) => path.slice(0, index));
  }

  //   // 2. To Close: This is called AFTER the animation finishes
  //   // We just remove the last item (or specific index) from the array
  //   onDrawerHide(index: number) {
  //     this.activePath.update((path) => path.slice(0, index));
  //   }

  //   // Jump back multiple steps immutably
  //   jumpTo(index: number) {
  //     this.activePath.update((path) => path.slice(0, index + 1));
  //   }

  //   // Starter. e.g. clicking on child node button in our table
  //   openFirst() {
  //     // 3. Kick off the stack by adding the root node
  //     this.activePath.set([this.menuData]);
  //   }

  // Called when a sibling in an existing drawer is clicked
  async openChild(node: NavNode) {
    this.isLoading.set(true);
    try {
      // 1. Fetch children for the specific node clicked
      const children = await lastValueFrom(
        this.http.get<NavNode[]>(`https://dummyjson.com/posts/${node.id}`)
      );

      // 2. Create the new level object
      const newNode: NavNode = {
        ...node,
        children,
        visible: true, // Ensure it starts visible for the animation
      };

      // 3. Immutably append to the stack
      this.activePath.update((path) => [...path, newNode]);
    } finally {
      this.isLoading.set(false);
    }
  }

  //   closeTop() {
  //     this.activePath.update((path) => path.slice(0, -1));
  //   }

  //   // Add a new drawer
  //   openNode(node: NavNode) {
  //     // Add to array with visible set to true to trigger "slide in"
  //     const newNode = { ...node, visible: true };
  //     this.activePath.update((path) => [...path, newNode]);
  //   }

  //   // Start the closing animation
  //   startClosing() {
  //     const currentPath = this.activePath();
  //     if (currentPath.length === 0) return;

  //     // 1. Create a copy of the last node and set visible to false
  //     const updatedLastNode = {
  //       ...currentPath[currentPath.length - 1],
  //       visible: false,
  //     };

  //     // 2. Update the array so PrimeNG sees [visible]="false" and starts animating
  //     this.activePath.update((path) => [...path.slice(0, -1), updatedLastNode]);
  //   }

  //   // Finalize removal (called by PrimeNG after animation ends)
  //   finalizeClose(index: number) {
  //     this.activePath.update((path) => {
  //       // If we close drawer #2, we remove #2 and any #3, #4 that might be on top
  //       return path.slice(0, index);
  //     });
  //   }
}
