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
  path?: string; // e.g., "root", "root/settings", "root/settings/privacy"
  data?: any;
  visible?: boolean; // Required for animation control
}

const flatNodes: NavNode[] = [
  { id: '1', label: 'Main', path: 'root' },
  { id: '2', label: 'Settings', path: 'root/settings' },
  { id: '4', label: 'Settings2', path: 'root/settings2' },
  { id: '3', label: 'Privacy', path: 'root/settings/privacy' }
];

@Component({
  selector: 'drawer-basic-demo',
  templateUrl: 'drawer-basic-demo.html',
  standalone: true,
  imports: [
    CommonModule,
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
    const currentStack = this.activePath().filter(n => n.visible !== false);

    return currentStack.map((node, index) => ({
      label: node.label,
      disabled: index === currentStack.length - 1,
      command: () => this.finalizeClose(index + 1)
    }));
  });

  rootStart() {
    this.openNext({
      id: '1',
      label: 'A',
      path: 'root',
      children: [
        {
          id: '2',
          label: 'B',
          children: [
            {
              id: '4',
              label: 'B1',
            },
            {
              id: '5',
              label: 'B2',
            }
          ]
        },
        {
          id: '3',
          label: 'C',
          children: [
            {
              id: '6',
              label: 'C1',
            },
            {
              id: '7',
              label: 'C2',
            }
          ]
        }
      ]
    })
  }


  openNext(nodeData: NavNode) {
    // // 1. Find the "siblings" (children) of the selected node
    // const children = flatNodes.filter(n => n.path.startsWith(`${selectedNode.path}/`));

    // // 2. Add the selected node to the stack
    // this.activePath.update(stack => [...stack, { ...selectedNode, visible: true, children }]);
    this.activePath.update((path) => [...path, { ...nodeData, visible: true }]);

  }

  handleVisibilityChange(isVisible: boolean, index: number) {
    console.log('::handleVisibilityChange', index, isVisible);
    this.activePath.update(path => {
      if (index >= path.length) return path;
      const newPath = [...path];
      // Replace the object reference to trigger the computed signal
      newPath[index] = { ...newPath[index], visible: isVisible };
      return newPath;
    });
  }

  finalizeClose(index: number) {
    this.activePath.update(path => {
      // If we close the very first drawer (index 0), clear everything.
      if (index === 0) return [];

      // Otherwise, only slice if it's the top drawer finishing its animation.
      return index === path.length - 1 ? [...path.slice(0, -1)] : path;
    });
  }
}
