import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerService,
  PdfLoadedEvent,
} from 'ngx-extended-pdf-viewer';

interface PdfFile {
  name: string;
  url: string;
}

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css'],
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  providers: [NgxExtendedPdfViewerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfComponent {
  @Output() viewerReady = new EventEmitter<void>();

  constructor(private pdfService: NgxExtendedPdfViewerService) {
    console.log('PDF component initialized');
  }

  onPdfLoaded(event: PdfLoadedEvent): void {
    console.log('PDF loaded', event);
    this.viewerReady.emit();
  }
  onPdfLoadError(error: any): void {
    console.error('PDF load error', error);
  }
}
