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
import { BreadcrumbModule } from 'primeng/breadcrumb';

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
  imports: [
    CommonModule, ss
    ThemeSwitcher,
    ButtonModule,
    DrawerModule,
    BreadcrumbModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['drawer-basic-demo.scss'],
})
export class DrawerBasicDemo {
  private http = inject(HttpClient);
  isLoading = signal(false);

  activePath = signal<readonly NavNode[]>([]);
  breadcrumbItems = computed<MenuItem[]>(() => {
    const currentPath = this.activePath().filter(node => node.visible !== false);
    return this.activePath()
      .map((node, index) => ({
        label: node.label,
        disabled: index === currentPath.length - 1,
        command: () => this.finalizeClose(index + 1)
      }));
  });

  openNext(nodeData: any) {
    this.activePath.update((path) => [...path, { ...nodeData, visible: true }]);
  }

  handleVisibilityChange(isVisible: boolean, index: number) {
    this.activePath.update(path => {
      const newPath = [...path];
      // Replace the object reference to trigger the computed signal
      newPath[index] = { ...newPath[index], visible: isVisible };
      return newPath;
    });
  }

  finalizeClose(index: number) {
    this.activePath.update(path => {
      if (index >= 0) {
        // Return a brand new array reference [...] to trigger Signal updates
        return [...path.slice(0, index)];
      }
      return path;
    });
  }
}
