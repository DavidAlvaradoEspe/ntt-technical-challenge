import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ContextMenu, ContextMenuItem} from './context-menu';

describe('ContextMenu', () => {
  let component: ContextMenu;
  let fixture: ComponentFixture<ContextMenu>;
  let compiled: HTMLElement;

  const mockMenuItems: ContextMenuItem[] = [
    { label: 'Edit', action: 'edit' },
    { label: 'Delete', action: 'delete' },
    { label: 'View', action: 'view' }
  ];

  function createMockButton(): HTMLElement {
    const button = document.createElement('button');
    button.style.position = 'absolute';
    button.style.top = '100px';
    button.style.left = '200px';
    button.style.width = '80px';
    button.style.height = '30px';
    document.body.appendChild(button);
    return button;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextMenu);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.items).toEqual([]);
      expect(component.containerClass).toBe('');
      expect(component.isVisible).toBe(false);
      expect(component.positionX).toBe(0);
      expect(component.positionY).toBe(0);
    });

    it('should accept items as input', () => {
      component.items = mockMenuItems;
      fixture.detectChanges();

      expect(component.items.length).toBe(3);
      expect(component.items[0].label).toBe('Edit');
    });

    it('should accept containerClass as input', () => {
      component.containerClass = 'custom-container';
      fixture.detectChanges();

      expect(component.containerClass).toBe('custom-container');
    });

    it('should not be visible initially', () => {
      expect(component.isVisible).toBe(false);

      const menuElement = compiled.querySelector('.context-menu');
      expect(menuElement).toBeTruthy();
      expect(menuElement?.classList.contains('context-menu--visible')).toBe(false);
    });
  });

  describe('show()', () => {
    let mockButton: HTMLElement;
    let mockEvent: MouseEvent;

    beforeEach(() => {
      mockButton = createMockButton();

      mockEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(mockEvent, 'currentTarget', {
        writable: false,
        value: mockButton
      });
    });

    afterEach(() => {
      document.body.removeChild(mockButton);
    });

    it('should show the menu when called', () => {
      component.items = mockMenuItems;

      component.show(mockEvent);

      expect(component.isVisible).toBe(true);
    });

    it('should set position when showing menu', () => {
      component.items = mockMenuItems;
      fixture.detectChanges();

      component.show(mockEvent);
      fixture.detectChanges();

      // Position should be set based on button position
      expect(component.positionX).toBeGreaterThanOrEqual(0);
      expect(component.positionY).toBeGreaterThanOrEqual(0);
    });

    it('should toggle menu visibility when clicking same button twice', () => {
      component.items = mockMenuItems;

      component.show(mockEvent);
      expect(component.isVisible).toBe(true);

      component.show(mockEvent);
      expect(component.isVisible).toBe(false);
    });

    it('should update lastClickTarget', () => {
      component.items = mockMenuItems;

      component.show(mockEvent);

      expect(component['lastClickTarget']).toBe(mockButton);
    });

    it('should show menu when clicking different button', () => {
      const button1 = mockButton;
      const button2 = document.createElement('button');
      document.body.appendChild(button2);

      const event1 = new MouseEvent('click');
      Object.defineProperty(event1, 'currentTarget', { value: button1 });

      const event2 = new MouseEvent('click');
      Object.defineProperty(event2, 'currentTarget', { value: button2 });

      component.show(event1);
      expect(component.isVisible).toBe(true);

      component.show(event2);
      expect(component.isVisible).toBe(true);
      expect(component['lastClickTarget']).toBe(button2);

      document.body.removeChild(button2);
    });
  });

  describe('hide()', () => {
    it('should hide the menu', () => {
      component.isVisible = true;
      component['lastClickTarget'] = document.createElement('button');

      component.hide();

      expect(component.isVisible).toBe(false);
      expect(component['lastClickTarget']).toBeNull();
    });

    it('should reset lastClickTarget to null', () => {
      component['lastClickTarget'] = document.createElement('button');

      component.hide();

      expect(component['lastClickTarget']).toBeNull();
    });
  });

  describe('onItemClick()', () => {
    it('should emit itemClicked event with action', () => {
      const emitSpy = jest.spyOn(component.itemClicked, 'emit');

      component.onItemClick('edit');

      expect(emitSpy).toHaveBeenCalledWith('edit');
    });

    it('should hide menu after item click', () => {
      component.isVisible = true;

      component.onItemClick('delete');

      expect(component.isVisible).toBe(false);
    });

    it('should emit correct action for each menu item', () => {
      const emitSpy = jest.spyOn(component.itemClicked, 'emit');

      component.onItemClick('view');
      expect(emitSpy).toHaveBeenCalledWith('view');

      component.onItemClick('edit');
      expect(emitSpy).toHaveBeenCalledWith('edit');

      expect(emitSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Template Rendering', () => {
    it('should render menu items when visible', () => {
      component.items = mockMenuItems;
      component.isVisible = true;
      fixture.detectChanges();

      const menuItems = compiled.querySelectorAll('.context-menu__item');
      expect(menuItems.length).toBe(3);
    });

    it('should render correct labels for menu items', () => {
      component.items = mockMenuItems;
      component.isVisible = true;
      fixture.detectChanges();

      const labels = Array.from(compiled.querySelectorAll('.context-menu__label'));
      const labelTexts = labels.map(label => label.textContent?.trim());

      expect(labelTexts).toContain('Edit');
      expect(labelTexts).toContain('Delete');
      expect(labelTexts).toContain('View');
    });

    it('should not render menu when not visible', () => {
      component.items = mockMenuItems;
      component.isVisible = false;
      fixture.detectChanges();

      const menuElement = compiled.querySelector('.context-menu');
      expect(menuElement).toBeTruthy();
      expect(menuElement?.classList.contains('context-menu--visible')).toBe(false);
    });

    it('should call onItemClick when clicking menu item', () => {
      component.items = mockMenuItems;
      component.isVisible = true;
      fixture.detectChanges();

      const onItemClickSpy = jest.spyOn(component, 'onItemClick');
      const firstItem = compiled.querySelector('.context-menu__item') as HTMLElement;

      firstItem.click();

      expect(onItemClickSpy).toHaveBeenCalledWith('edit');
    });

    it('should apply correct position styles', () => {
      component.items = mockMenuItems;
      component.isVisible = true;
      component.positionX = 150;
      component.positionY = 200;
      fixture.detectChanges();

      const menuElement = compiled.querySelector('.context-menu') as HTMLElement;

      expect(menuElement.style.left).toBe('150px');
      expect(menuElement.style.top).toBe('200px');
    });
  });

  describe('onDocumentClick()', () => {
    it('should hide menu when clicking outside', () => {
      component.isVisible = true;
      component['lastClickTarget'] = document.createElement('button');

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', {
        writable: false,
        value: outsideElement
      });

      component.onDocumentClick(clickEvent);

      expect(component.isVisible).toBe(false);

      document.body.removeChild(outsideElement);
    });

    it('should not hide menu when clicking inside menu', () => {
      component.isVisible = true;
      component.items = mockMenuItems;
      fixture.detectChanges();

      const menuElement = compiled.querySelector('.context-menu') as HTMLElement;

      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', {
        writable: false,
        value: menuElement
      });

      component.onDocumentClick(clickEvent);

      expect(component.isVisible).toBe(true);
    });

    it('should not hide menu when clicking on lastClickTarget', () => {
      const button = document.createElement('button');
      component.isVisible = true;
      component['lastClickTarget'] = button;

      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', {
        writable: false,
        value: button
      });

      component.onDocumentClick(clickEvent);

      expect(component.isVisible).toBe(true);
    });

    it('should not do anything if menu is not visible', () => {
      component.isVisible = false;

      const outsideElement = document.createElement('div');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', {
        writable: false,
        value: outsideElement
      });

      const hideSpy = jest.spyOn(component, 'hide');

      component.onDocumentClick(clickEvent);

      expect(hideSpy).not.toHaveBeenCalled();
    });
  });

  describe('updateMenuPosition() - Private Method', () => {
    let mockButton: HTMLElement;

    beforeEach(() => {
      mockButton = createMockButton();

      component.items = mockMenuItems;
      component.isVisible = true;
      fixture.detectChanges();
    });

    afterEach(() => {
      if (mockButton.parentElement) {
        document.body.removeChild(mockButton);
      }
    });

    it('should position menu to the right of button by default', () => {
      const mockEvent = new MouseEvent('click');
      Object.defineProperty(mockEvent, 'currentTarget', {
        writable: false,
        value: mockButton
      });

      component.show(mockEvent);

      const buttonRect = mockButton.getBoundingClientRect();
      expect(component.positionX).toBeGreaterThanOrEqual(buttonRect.right);
    });

    it('should handle case when context menu element is not found', () => {
      component.isVisible = false;
      fixture.detectChanges();

      const mockEvent = new MouseEvent('click');
      Object.defineProperty(mockEvent, 'currentTarget', {
        writable: false,
        value: mockButton
      });

      // Should not throw error
      expect(() => component.show(mockEvent)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      component.items = [];
      component.isVisible = true;
      fixture.detectChanges();

      const menuItems = compiled.querySelectorAll('.context-menu__item');
      expect(menuItems.length).toBe(0);
    });

    it('should handle single menu item', () => {
      component.items = [{ label: 'Only Item', action: 'only' }];
      component.isVisible = true;
      fixture.detectChanges();

      const menuItems = compiled.querySelectorAll('.context-menu__item');
      expect(menuItems.length).toBe(1);
    });

    it('should handle many menu items', () => {
      component.items = Array.from({length: 10}, (_, i) => ({
        label: `Item ${i}`,
        action: `action${i}`
      }));
      component.isVisible = true;
      fixture.detectChanges();

      const menuItems = compiled.querySelectorAll('.context-menu__item');
      expect(menuItems.length).toBe(10);
    });

    it('should handle special characters in labels', () => {
      component.items = [
        { label: '<script>alert("xss")</script>', action: 'xss' },
        { label: 'Español: año, niño', action: 'spanish' },
        { label: '日本語', action: 'japanese' }
      ];
      component.isVisible = true;
      fixture.detectChanges();

      const labels = Array.from(compiled.querySelectorAll('.context-menu__label'));
      expect(labels.length).toBe(3);
    });

    it('should handle rapid show/hide calls', () => {
      const mockButton = document.createElement('button');
      document.body.appendChild(mockButton);

      const mockEvent = new MouseEvent('click');
      Object.defineProperty(mockEvent, 'currentTarget', {
        writable: false,
        value: mockButton
      });

      component.show(mockEvent);
      component.hide();
      component.show(mockEvent);
      component.hide();

      expect(component.isVisible).toBe(false);

      document.body.removeChild(mockButton);
    });
  });

  describe('Input/Output Integration', () => {
    it('should properly bind items input', () => {
      const testItems: ContextMenuItem[] = [
        { label: 'Test1', action: 'test1' },
        { label: 'Test2', action: 'test2' }
      ];

      component.items = testItems;
      fixture.detectChanges();

      expect(component.items).toBe(testItems);
    });

    it('should emit event through itemClicked output', (done) => {
      component.itemClicked.subscribe((action: string) => {
        expect(action).toBe('test-action');
        done();
      });

      component.onItemClick('test-action');
    });

    it('should handle containerClass input properly', () => {
      component.containerClass = 'my-custom-container';

      expect(component.containerClass).toBe('my-custom-container');
    });
  });
});
